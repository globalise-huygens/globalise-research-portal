import { z } from 'zod';
import type { HtrHit } from '@globalise/common/document';
import { createServerFn } from '@tanstack/react-start';
import elastic from './client.server';
import { getSearchQuery, GlobaliseSearchStateSchema } from './elastic.server';
import { isHit, parseAnnotatedText } from './parseAnnotatedText';
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
    target: z.union([
      z.object({ snippet: z.string() }),
      z.object({ esHitIndex: z.number().int().min(0) }),
    ]),
  });

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
    const { target } = data;
    const activeEsHitIndex = 'snippet' in target
      ? findActiveEsHitIndex(esHits, getSnippetOffsets(plainText, target.snippet))
      : target.esHitIndex;
    return { hits, activeEsHitIndex };
  });

export default highlightDocument;

async function fetchAnnotatedText(request: ManifestSearchState): Promise<string | undefined> {
  const { docDbId } = request;
  const query = getSearchQuery(request.query, { selected: request.facets, documentName: docDbId });
  const result = await elastic.search({
    index: 'documents',
    size: 1,
    _source: false,
    highlight: {
      fields: {
        annotatedText: { type: 'annotated', number_of_fragments: 0 },
      },
    },
    query: query ?? undefined,
  });
  return result.hits.hits[0]?.highlight?.annotatedText[0];
}
