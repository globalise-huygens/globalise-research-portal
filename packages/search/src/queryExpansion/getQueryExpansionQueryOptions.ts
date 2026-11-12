import { queryOptions } from '@tanstack/react-query';

const url = 'https://kweepeer.globalise.nl';

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

const INCLUDED_MODULES = 'embeddings,inthislex';

export default function getQueryExpansionQueryOptions(query: string) {
  return queryOptions({
    queryKey: ['query_expansion', query],
    staleTime: 1000 * 60 * 5, // 5 minutes
    queryFn: async (): Promise<QueryExpansion> => {
      // Nothing to expand without a query
      if (!query.trim()) {
        return { original_query: query, query, query_expansion_template: query, terms: {} };
      }

      try {
        const result = await fetch(`${url}?q=${encodeURIComponent(query)}&include=${INCLUDED_MODULES}`);
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
