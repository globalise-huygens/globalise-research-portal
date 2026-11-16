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
    docEsId: z.string(),
    snippet: z.string(),
  });

const highlightDocument = createServerFn({ method: 'POST' })
  .validator(HighlightDocumentRequestSchema)
  .handler(async ({ data }): Promise<DocumentHighlights> => {
    const document = await fetchHighlightedDocument(data);
    if (!document) {
      return { hits: [], activeEsHitIndex: null };
    }
    const { text, spans: offsets } = getHighlight(document.taggedText, PRE_TAG, POST_TAG);
    const mappings = selectTextRangeMappings(document.name);
    const hits = offsets.flatMap((offset, esHitIndex) => {
      const htrOffsets = calculateHtrOffsets(offset, mappings);
      const mergedOffsets = mergeContinuousOffsets(htrOffsets, '-\n'.length);
      return mergedOffsets.map((offsets, pageOffsetsIndex) => ({
        id: `urn:globalise:search-hit:${esHitIndex}-${pageOffsetsIndex}`,
        ...offsets,
        esHitIndex,
      }));
    });
    const snippet = getSnippetOffsets(text, data.snippet);
    const activeEsHitIndex = findActiveEsHitIndex(offsets, snippet);
    return { hits, activeEsHitIndex };
  });

export default highlightDocument;

type HighlightedDocument = {
  name: string;
  taggedText: string;
};

async function fetchHighlightedDocument(request: ManifestSearchState): Promise<HighlightedDocument | undefined> {
  const result = await elastic.search<{ name: string }>({
    index: 'documents',
    size: 1,
    _source: ['name'],
    highlight: {
      fields: {
        annotatedText: { type: 'annotated', number_of_fragments: 0 },
      },
    },
    query: getSearchQuery(request.query, request.facets, request.docEsId) ?? undefined,
  });
  const hit = result.hits.hits[0];
  const annotatedText = hit?.highlight?.annotatedText[0];
  return hit?._source && annotatedText
    ? { name: hit._source.name, taggedText: tagAnnotatedHits(annotatedText) }
    : undefined;
}
