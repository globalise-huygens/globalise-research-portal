import { z } from 'zod';
import parseQuery from './parseQuery.server';

import type { TreeQuery } from '@knaw-huc/searchfield';
import type { QueryDslQueryContainer } from '@elastic/elasticsearch/lib/api/types';
import type { GlobaliseSearchState } from '../utils/getSearchState';

export type FacetRequest = GlobaliseSearchState & {
  key: string;
};

export type HierarchyFacet = {
  tree: string;
};

export type RangeFacet = {
  buckets: string;
  start: string;
  end: string;
};

export const hierarchyFacets: Record<string, HierarchyFacet> = {
  'ead': {
    tree: 'eadIdPaths.tree',
  },
  'profession': {
    tree: 'professionIdPaths.tree',
  },
  'document_type': {
    tree: 'documentTypeIdPaths.tree',
  },
};

export const rangeFacets: Record<string, RangeFacet> = {
  'date': {
    buckets: 'dateBuckets',
    start: 'startDate',
    end: 'endDate',
  },
};

export const GlobaliseSearchStateSchema = z.object({
  query: z.looseObject({}).optional() as unknown as z.ZodType<TreeQuery | undefined>,
  facets: z.record(z.string(), z.array(z.string())).refine(
    (record) => Object.keys(record).every((key) => [
      ...Object.keys(hierarchyFacets),
      ...Object.keys(rangeFacets),
    ].includes(key)),
    { error: 'Invalid facet key requested!' },
  ).refine(
    (record) => Object.entries(record)
      .filter(([key]) => Object.keys(rangeFacets).includes(key))
      .every(([_key, value]) => value.length === 1 && /^\d+:\d+$/.test(value[0])),
    { error: 'Range facet must have format "start:end"!' },
  ).optional(),
});

export function getSearchQuery(query?: TreeQuery, selected?: Record<string, string[]>): QueryDslQueryContainer | null {
  const selectedHierarchies = getSelectedForFacet(selected, hierarchyFacets);
  const selectedRanges = getSelectedForFacet(selected, rangeFacets);
  if (!query && !selectedHierarchies && !selectedRanges) {
    return null;
  }

  const esQuery = query ? parseQuery(query) : undefined;
  const hierarchyFilters = selectedHierarchies ? Object.entries(selectedHierarchies).map(([key, value]) => ({
    terms: {
      [hierarchyFacets[key].tree]: value,
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
  const filters = [...hierarchyFilters, ...rangeFilters];

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
