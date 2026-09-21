import { queryOptions } from '@tanstack/react-query';

const url = 'https://kweepeer.dev.huc.knaw.nl';

export type QueryExpansion = {
  original_query: string;
  query: string;
  query_expansion_template: string;
  terms: Record<string, SourceExpansion[]>;
};

export type SourceExpansion = {
  expansions: string[];
  source_id: string;
  source_name: string;
};

export default function getQueryExpansionQueryOptions(query: string) {
  return queryOptions({
    queryKey: ['query_expansion', query],
    staleTime: 1000 * 60 * 5, // 5 minutes
    queryFn: async () => {
      try {
        const result = await fetch(`${url}?q=${encodeURIComponent(query)}`);
        if (!result.ok) {
          throw new Error(`Failed to obtain query expansions for: ${query}`);
        }

        return await result.json() as QueryExpansion;
      }
      // TODO: Disable query expansion while using dev instance
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      catch (e: unknown) {
        return { original_query: query, query, query_expansion_template: query, terms: {} };
      }
    },
  });
}
