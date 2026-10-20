import { z } from 'zod';
import type { HtrHit } from '@globalise/common/document';
import { createServerFn } from '@tanstack/react-start';
import { getHighlight } from '@knaw-huc/faceted-search-react';
import elastic from './client.server';
import { getSearchQuery, GlobaliseSearchStateSchema } from './elastic.server';
import { POST_TAG, PRE_TAG } from './highlightTags';
import { getSnippetOffsets } from './getSnippetOffsets';
import { calculateHtrOffsets } from './calculateHtrOffsets';
import { findActiveEsHitIndex } from './findActiveEsHitIndex';
import { mergeContinuousOffsets } from './mergeContinuousOffsets.ts';
import { selectTextRangeMappings } from './selectTextRangeMappings.server';

import type { ManifestSearchState } from '../utils/getManifestSearchState';

export type DocumentHighlights = {
  hits: HtrHit[];
  activeEsHitIndex: number | null;
};

const HighlightDocumentRequestSchema = GlobaliseSearchStateSchema
  .extend({
    docDbId: z.string(),
    docEsId: z.string(),
    snippet: z.string(),
  });

const highlightDocument = createServerFn({ method: 'POST' })
  .validator(HighlightDocumentRequestSchema)
  .handler(async ({ data }): Promise<DocumentHighlights> => {
    const taggedText = await fetchTaggedText(data);
    if (!taggedText) {
      return { hits: [], activeEsHitIndex: null };
    }
    // TODO: use parseAnnotatedText from parse-es-annotated-text
    const { text, spans: offsets } = getHighlight(taggedText, PRE_TAG, POST_TAG);
    const mappings = selectTextRangeMappings(data.docDbId);
    const hits = offsets.flatMap((offset, esHitIndex) => {
      const htrOffsets = calculateHtrOffsets(offset, mappings);
      const mergedOffsets = mergeContinuousOffsets(htrOffsets, '-\n'.length);
      return mergedOffsets.map((offsets, pageOffsetsIndex) => ({
        id: `search-hit-${esHitIndex}-${pageOffsetsIndex}`,
        ...offsets,
        esHitIndex,
      }));
    });
    const snippet = getSnippetOffsets(text, data.snippet);
    const activeEsHitIndex = findActiveEsHitIndex(offsets, snippet);
    return { hits, activeEsHitIndex };
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
    query: getSearchQuery(request.query, request.facets, request.docEsId) ?? undefined,
  });
  return result.hits.hits[0]?.highlight?.text[0];
}
