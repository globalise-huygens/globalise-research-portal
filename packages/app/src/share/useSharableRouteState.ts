import {
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
  const selectedDocument = selectedDocumentId
    ? parseDocumentId(selectedDocumentId) ?? null
    : null;
  const stored = { selectedDocument, searchHit, searchHitQuery };
  return collectSharableRouteState(viewer, stored);
}
