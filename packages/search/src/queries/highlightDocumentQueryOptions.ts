import { queryOptions, skipToken } from '@tanstack/react-query';
import { startCanvasTiming } from '@globalise/common/document';
import highlightDocument from '../elasticsearch/highlightDocument.server';
import type { ManifestSearchState } from '../utils/getManifestSearchState';

export default function highlightDocumentQueryOptions(state?: ManifestSearchState) {
  return queryOptions({
    queryKey: ['highlightDocument', state],
    staleTime: Infinity,
    queryFn: state ? () => fetchHighlights(state) : skipToken,
  });
}

async function fetchHighlights(state: ManifestSearchState) {
  const endTiming = startCanvasTiming('highlight query', { docDbId: state.docDbId });
  try {
    const highlights = await highlightDocument({ data: state });
    endTiming({ hits: highlights.hits.length, activeEsHitIndex: highlights.activeEsHitIndex });
    return highlights;
  } catch (error) {
    endTiming({ error: error instanceof Error ? error.message : String(error) });
    throw error;
  }
}
