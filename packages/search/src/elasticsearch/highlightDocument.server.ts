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
import { mergeContinuations } from './mergeContinuations';
import { selectTextRangeMappings } from './selectTextRangeMappings.server';

import type { ManifestSearchState } from '../utils/getManifestSearchState';

const maxLineBreakLength = '-\n'.length;

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
    const esStart = performance.now();
    const taggedText = await fetchTaggedText(data);
    const esMs = Math.round(performance.now() - esStart);
    if (!taggedText) {
      console.info('highlightDocument: no tagged text', { docEsId: data.docEsId, esMs });
      return { hits: [], activeEsHitIndex: null };
    }
    // TODO: use parseAnnotatedText from parse-es-annotated-text
    const { text, spans: offsets } = getHighlight(taggedText, PRE_TAG, POST_TAG);
    const dbStart = performance.now();
    const mappings = selectTextRangeMappings(data.docDbId);
    const dbMs = Math.round(performance.now() - dbStart);
    const calculationStart = performance.now();
    const hits = offsets.flatMap((offset, esHitIndex) => {
      const htr = calculateHtrOffsets(offset, mappings);
      const merged = mergeContinuations(htr, maxLineBreakLength);
      return merged.map((h) => ({ ...h, esHitIndex }));
    });
    const snippet = getSnippetOffsets(text, data.snippet);
    const activeEsHitIndex = findActiveEsHitIndex(offsets, snippet);
    const calculationMs = Math.round(performance.now() - calculationStart);
    console.info('highlightDocument', {
      docEsId: data.docEsId,
      docDbId: data.docDbId,
      esHits: offsets.length,
      mappings: mappings.length,
      htrHits: hits.length,
      snippet,
      activeEsHitIndex,
      esMs,
      dbMs,
      calculationMs,
    });
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
