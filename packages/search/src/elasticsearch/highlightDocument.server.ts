import { z } from 'zod';
import { createServerFn } from '@tanstack/react-start';
import elastic from './client.server';
import { getSearchQuery, GlobaliseSearchStateSchema } from './elastic.server';
import { POST_TAG, PRE_TAG } from './highlightTags';
import { getHighlight, type Offsets } from './getHighlight';
import { getSnippetOffsets } from './getSnippetOffsets';

import type { ManifestSearchState } from '../utils/getManifestSearchState';

export type DocumentHighlights = {
  hits: Offsets[];
  snippet: Offsets | null;
};

const HighlightDocumentRequestSchema = GlobaliseSearchStateSchema
  .extend({
    documentId: z.string(),
    snippet: z.string(),
  });

const highlightDocument = createServerFn({ method: 'POST' })
  .validator(HighlightDocumentRequestSchema)
  .handler(async ({ data }): Promise<DocumentHighlights> => {
    const taggedText = await fetchTaggedText(data);
    if (!taggedText) {
      return { hits: [], snippet: null };
    }
    // TODO: use parseAnnotatedText from parse-es-annotated-text
    const { text, spans } = getHighlight(taggedText, PRE_TAG, POST_TAG);
    // TODO: convert to htr using text-coordinate-mapping:
    // const hits = fetchHtrOffsets(spans, data.documentId)
    return { hits: spans, snippet: getSnippetOffsets(text, data.snippet) };
  });

export default highlightDocument;

async function fetchTaggedText(request: ManifestSearchState): Promise<string | undefined> {
  const result = await elastic.search({
    index: 'documents',
    size: 1,
    _source: false,
    highlight: {
      pre_tags: [PRE_TAG],
      post_tags: [POST_TAG],
      fields: {
        text: { number_of_fragments: 0 },
      },
    },
    query: {
      bool: {
        must: getSearchQuery(request.query, request.facets) ?? undefined,
        filter: { ids: { values: [request.documentId] } },
      },
    },
  });
  return result.hits.hits[0]?.highlight?.text[0];
}
