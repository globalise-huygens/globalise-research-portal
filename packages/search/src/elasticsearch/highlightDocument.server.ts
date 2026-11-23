import { z } from 'zod';
import type { HtrHit } from '@globalise/common/document';
import { createServerFn } from '@tanstack/react-start';
import elastic from './client.server';
import { checkFacets, getSearchQuery, GlobaliseSearchStateSchema } from './elastic.server';
import { isHit, parseAnnotatedText } from './parseAnnotatedText';
import { getSnippetOffsets } from './getSnippetOffsets';
import { calculateHtrOffsets } from './calculateHtrOffsets';
import { findActiveEsHitIndex } from './findActiveEsHitIndex';
import { mergeContinuousOffsets } from './mergeContinuousOffsets.ts';
import { selectTextRangeMappings } from './selectTextRangeMappings.server';

import type { ManifestSearchState } from '../utils/getManifestSearchState';
import documents from '../indices/documents/index.ts';

export type DocumentHighlights = {
  hits: HtrHit[];
  activeEsHitIndex: number | null;
};

const HighlightDocumentRequestSchema = GlobaliseSearchStateSchema
  .extend({
    docDbId: z.string(),
    docEsId: z.string(),
    snippet: z.string(),
    // Highlighted documents are only used with the 'documents' index, so it's hardcoded below
  }).superRefine((data, ctx) => checkFacets({ ...data, index: 'documents' }, ctx));

const highlightDocument = createServerFn({ method: 'POST' })
  .validator(HighlightDocumentRequestSchema)
  .handler(async ({ data }): Promise<DocumentHighlights> => {
    const annotatedText = await fetchAnnotatedText(data);
    if (!annotatedText) {
      return { hits: [], activeEsHitIndex: null };
    }
    const { plainText, segments } = parseAnnotatedText(annotatedText);
    const esHits = segments.filter(isHit);
    const mappings = selectTextRangeMappings(data.docDbId);
    const hits = esHits.flatMap((esHit, esHitIndex) => {
      const htrOffsets = calculateHtrOffsets(esHit, mappings);
      const mergedOffsets = mergeContinuousOffsets(htrOffsets, '-\n'.length);
      return mergedOffsets.map((offsets, pageOffsetsIndex) => ({
        id: `urn:globalise:search-hit:${esHitIndex}-${pageOffsetsIndex}`,
        ...offsets,
        esHitIndex,
      }));
    });
    const snippet = getSnippetOffsets(plainText, data.snippet);
    const activeEsHitIndex = findActiveEsHitIndex(esHits, snippet);
    return { hits, activeEsHitIndex };
  });

export default highlightDocument;

async function fetchAnnotatedText(request: ManifestSearchState): Promise<string | undefined> {
  const result = await elastic.search({
    // Highlighted documents are only used with the 'documents' index, so it's hardcoded below
    index: 'documents',
    size: 1,
    _source: false,
    highlight: {
      fields: {
        annotatedText: { type: 'annotated', number_of_fragments: 0 },
      },
    },
    query: getSearchQuery(documents, request.query, request.facets, request.docEsId) ?? undefined,
  });
  return result.hits.hits[0]?.highlight?.annotatedText[0];
}
