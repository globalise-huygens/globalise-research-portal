import { z } from 'zod';
import { createServerFn } from '@tanstack/react-start';
import elastic from './client.server';
import { checkFacets, getSearchQuery, GlobaliseSearchStateSchema } from './elastic.server';

import type { IndexForSearch, SearchResult } from '../indices/indexTypes';
import { indices, indexKeys } from '../indices';

const SearchRequestSchema = GlobaliseSearchStateSchema.extend({
  index: z.enum(indexKeys),
  offset: z.number().min(0).optional(),
  limit: z.number().min(1).optional(),
}).superRefine(checkFacets);

const search = createServerFn({ method: 'POST' })
  .validator(SearchRequestSchema)
  .handler(async ({ data }): Promise<SearchResult[]> => {
    const index: IndexForSearch = indices[data.index];

    const result = await elastic.search({
      index: index.esIndex,
      from: data.offset ?? 0,
      size: data.limit ?? 10,
      highlight: index.highlight,
      _source: index.source,
      query: getSearchQuery(index, data.query, data.facets) ?? undefined,
    });

    return result.hits.hits.map((hit) => index.toResult(hit));
  });

export default search;
