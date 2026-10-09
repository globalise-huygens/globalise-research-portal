import { queryOptions } from '@tanstack/react-query';
import autocomplete, { type AutocompleteRequest } from '../elasticsearch/autocomplete.server';

export default function autocompleteQueryOptions(request: AutocompleteRequest) {
  return queryOptions({
    queryKey: ['autocomplete', request.query],
    queryFn: () => autocomplete({ data: request }),
  });
}
