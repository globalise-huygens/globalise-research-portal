import {
  useActiveEsHitIndex,
  useSearchHitQuery,
  useSearchHitRequest,
  useSelectedDocumentId,
} from '@globalise/common/document';
import { type ViewerRef, parseDocumentId } from '@globalise/common/uri';
import { type SharableRouteState, collectSharableRouteState } from './collectSharableRouteState.ts';

export function useSharableRouteState(viewer: ViewerRef): SharableRouteState {
  const selectedDocumentId = useSelectedDocumentId();
  const searchHit = useSearchHitRequest();
  const searchHitQuery = useSearchHitQuery();
  const activeEsHitIndex = useActiveEsHitIndex();
  const selectedDocument = selectedDocumentId
    ? parseDocumentId(selectedDocumentId)
    : undefined;
  const stored = { selectedDocument, searchHit, searchHitQuery, activeEsHitIndex };
  return collectSharableRouteState(viewer, stored);
}
