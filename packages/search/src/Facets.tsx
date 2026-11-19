import HierarchyFacet from './HierarchyFacet';
import RangeFacet from './RangeFacet';
import { type Facet, facets } from '@globalise/router';

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
    case 'range':
      return <RangeFacet facetKey={facet.key}/>;
  }
}
