import { useTextFacet } from '@knaw-huc/panoptes-react';
import FilterFacet from './FilterFacet';
import FilterFacetItems from './FilterFacetItems';

export type Facet = {
  key: string,
  label: string,
  type: 'filter',
};

// eslint-disable-next-line react-refresh/only-export-components
export const facets: Facet[] = [{
  key: 'archive',
  label: 'Archive Hierarchy',
  type: 'filter',
}];

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
    <FilterFacet facetKey={facet.key}>
      <FilterFacetItemsRendering name={facet.key}/>
    </FilterFacet>
  );
}

function FilterFacetItemsRendering({ name }: { name: string }) {
  const { items } = useTextFacet(name);

  return (
    <FilterFacetItems items={items}/>
  );
}
