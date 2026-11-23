import { z } from 'zod';
import type { TreeQuery } from '@knaw-huc/searchfield';
import type { QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types';
import type { IndexForQuery } from '../indices/indexTypes';
import { type IndexKey, indices } from '../indices';

const TreeQuerySchema = z.looseObject({}) as unknown as z.ZodType<TreeQuery>;

export const GlobaliseSearchStateSchema = z.object({
  query: TreeQuerySchema.optional(),
  facets: z.record(z.string(), z.array(z.string())).optional(),
});

export function checkFacets(
  data: { index: IndexKey; facets?: Record<string, string[]> },
  ctx: z.RefinementCtx,
) {
  const { hierarchyFacets, rangeFacets } = indices[data.index];
  for (const [key, values] of Object.entries(data.facets ?? {})) {
    if (Object.hasOwn(rangeFacets, key)) {
      if (values.length !== 1 || !/^\d+:\d+$/.test(values[0])) {
        ctx.addIssue({ code: 'custom', path: ['facets', key], message: `Range facet '${key}' must have format "start:end"` });
      }
    } else if (!Object.hasOwn(hierarchyFacets, key)) {
      ctx.addIssue({ code: 'custom', path: ['facets', key], message: `Invalid facet key '${key}' for index '${data.index}'` });
    }
  }
}

export function getSearchQuery(
  index: IndexForQuery,
  query?: TreeQuery,
  selected?: Record<string, string[]>,
  documentId?: string,
): QueryDslQueryContainer | null {
  const selectedHierarchies = getSelectedForFacet(selected, index.hierarchyFacets);
  const selectedRanges = getSelectedForFacet(selected, index.rangeFacets);
  if (!query && !selectedHierarchies && !selectedRanges && !documentId) {
    return null;
  }

  const esQuery = query ? index.compile(query) : undefined;
  if (esQuery === null) {
    return { match_none: {} };
  }
  const hierarchyFilters = selectedHierarchies ? Object.entries(selectedHierarchies).map(([key, value]) => ({
    terms: {
      [index.hierarchyFacets[key].tree]: value,
    },
  })) : [];
  // TODO: Add ElasticSearch filtering for ranges: https://www.elastic.co/docs/reference/query-languages/query-dsl/query-dsl-range-query
  // const rangeFilters = selectedRanges ? Object.entries(selectedRanges).flatMap(([key, value]) => [{
  //   range: {
  //     [rangeFacets[key].start]: {
  //       gte: Number(value[0].split(':')[0]),
  //     },
  //   },
  // }, {
  //   range: {
  //     [rangeFacets[key].end]: {
  //       lte: Number(value[0].split(':')[1]),
  //     },
  //   },
  // }]) : [];
  const rangeFilters: object[] = [];
  const documentFilters = documentId ? [{ ids: { values: [documentId] } }] : [];
  const filters = [...hierarchyFilters, ...rangeFilters, ...documentFilters];

  return {
    bool: {
      must: esQuery,
      filter: filters.length > 0 ? filters : undefined,
    },
  };
}

function getSelectedForFacet(selected: Record<string, string[]> | undefined, facet: Record<string, unknown>) {
  if (selected) {
    const filtered = Object.fromEntries(
      Object.entries(selected).filter(([key]) =>
        Object.keys(facet).includes(key)));

    if (Object.keys(filtered).length > 0) {
      return filtered;
    }
  }

  return null;
}
