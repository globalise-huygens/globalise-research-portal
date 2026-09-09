import FilterFacet from './FilterFacet';

export type Facet = {
  key: string,
  label: string,
  type: 'filter',
};

// eslint-disable-next-line react-refresh/only-export-components
export const facets: Facet[] = [
  {
    key: 'eadIdPaths.tree',
    label: 'Archive',
    type: 'filter',
  }, {
    key: 'professionIdPaths.tree',
    label: 'Profession',
    type: 'filter',
  }, {
    key: 'documentTypeIdPaths.tree',
    label: 'Document Type',
    type: 'filter',
  },
];

export default function Facets() {
  return (
    <>
      {facets.map((facet) =>
        <FacetRendering key={facet.key} facet={facet}/>)}
    </>
  );
}

function FacetRendering({ facet }: { facet: Facet }) {
  switch (facet.type) {
    case 'filter':
      return (
        <FilterFacetRendering facet={facet}/>
      );
  }
}

function FilterFacetRendering({ facet }: { facet: Facet }) {
  return (
    <FilterFacet facetKey={facet.key}/>
  );
}
