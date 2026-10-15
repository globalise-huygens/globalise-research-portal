import { queryOptions, skipToken } from '@tanstack/react-query';
import highlightDocument from '../elasticsearch/highlightDocument.server';
import type { ManifestSearchState } from '../utils/getManifestSearchState';

export default function highlightDocumentQueryOptions(state?: ManifestSearchState) {
  return queryOptions({
    queryKey: ['highlightDocument', state],
    staleTime: Infinity,
    queryFn: state ? () => highlightDocument({ data: state }) : skipToken,
  });
}
