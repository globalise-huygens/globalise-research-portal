import { z } from 'zod';
import { createServerFn } from '@tanstack/react-start';
import { getHighlight, type Offsets } from '@knaw-huc/faceted-search-react';
import elastic from './client.server';
import { getSearchQuery, GlobaliseSearchStateSchema } from './elastic.server';
import { POST_TAG, PRE_TAG } from './highlightTags';
import { getSnippetOffsets } from './getSnippetOffsets';
import { calculateHtrOffsets, type PageOffsets } from './calculateHtrOffsets';
import { mergeContinuations } from './mergeContinuations';
import { selectTextRangeMappings } from './selectTextRangeMappings.server';

import type { ManifestSearchState } from '../utils/getManifestSearchState';

const maxLineBreakLength = '-\n'.length;

export type DocumentHighlights = {
  hits: PageOffsets[];
  snippet: Offsets | null;
};

const HighlightDocumentRequestSchema = GlobaliseSearchStateSchema
  .extend({
    document: z.string(),
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
    const { text, spans: offsets } = getHighlight(taggedText, PRE_TAG, POST_TAG);
    const mappings = selectTextRangeMappings(data.document);
    const hits = offsets.flatMap((offset) => {
      const htrOffsets = calculateHtrOffsets(offset, mappings);
      return mergeContinuations(htrOffsets, maxLineBreakLength);
    });
    return { hits, snippet: getSnippetOffsets(text, data.snippet) };
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
