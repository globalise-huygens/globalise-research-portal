export type Facet = {
  key: string,
  label: string,
  type: 'hierarchy' | 'range',
};

export const facets = [
  {
    key: 'date',
    label: 'Date',
    type: 'range',
  }, {
    key: 'ead',
    label: 'Archive',
    type: 'hierarchy',
  }, {
    key: 'profession',
    label: 'Profession',
    type: 'hierarchy',
  }, {
    key: 'document_type',
    label: 'Document Type',
    type: 'hierarchy',
  },
] as const satisfies readonly Facet[];

export type FacetKey = typeof facets[number]['key'];
