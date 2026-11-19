import { z } from 'zod';
import type { HtrHit } from '@globalise/common/document';
import { createServerFn } from '@tanstack/react-start';
import { getHighlight } from '@knaw-huc/faceted-search-react';
import elastic from './client.server';
import { getSearchQuery, GlobaliseSearchStateSchema } from './elastic.server';
import { POST_TAG, PRE_TAG } from './highlightTags';
import { tagAnnotatedHits } from './tagAnnotatedHits';
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
    const taggedText = await fetchTaggedText(data);
    if (!taggedText) {
      return { hits: [], activeEsHitIndex: null };
    }
    const { text, spans: offsets } = getHighlight(taggedText, PRE_TAG, POST_TAG);
    const mappings = selectTextRangeMappings(data.docDbId);
    const hits = offsets.flatMap((offset, esHitIndex) => {
      const htrOffsets = calculateHtrOffsets(offset, mappings);
      const mergedOffsets = mergeContinuousOffsets(htrOffsets, '-\n'.length);
      return mergedOffsets.map((offsets, pageOffsetsIndex) => ({
        id: `urn:globalise:search-hit:${esHitIndex}-${pageOffsetsIndex}`,
        ...offsets,
        esHitIndex,
      }));
    });
    const { target } = data;
    const activeEsHitIndex = 'snippet' in target
      ? findActiveEsHitIndex(offsets, getSnippetOffsets(text, target.snippet))
      : target.esHitIndex;
    return { hits, activeEsHitIndex };
  });

export default highlightDocument;

async function fetchTaggedText(request: ManifestSearchState): Promise<string | undefined> {
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
  const annotatedText = result.hits.hits[0]?.highlight?.annotatedText[0];
  return annotatedText && tagAnnotatedHits(annotatedText);
}
