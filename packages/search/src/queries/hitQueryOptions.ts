import { queryOptions } from '@tanstack/react-query';
import findHit, { type FindHitRequest } from '../elasticsearch/findHit.server';

export default function hitQueryOptions(request: FindHitRequest) {
  return queryOptions({
    queryKey: ['hit', request.documentId, request.snippet],
    staleTime: Infinity,
    queryFn: () => findHit({ data: request }),
  });
}
