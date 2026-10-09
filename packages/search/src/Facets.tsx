import HierarchyFacet from './HierarchyFacet';

export type Facet = {
  key: string,
  label: string,
  type: 'hierarchy',
};

// eslint-disable-next-line react-refresh/only-export-components
export const facets: Facet[] = [
  {
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
    case 'hierarchy':
      return <HierarchyFacet facetKey={facet.key}/>;
  }
}
