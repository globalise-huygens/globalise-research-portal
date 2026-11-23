import type { HierarchyFacet, RangeFacet } from '../indexTypes';

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