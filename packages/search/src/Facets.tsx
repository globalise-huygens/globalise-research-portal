import HierarchyFacet from './HierarchyFacet';
import RangeFacet from './RangeFacet';

import { facets, type Facet } from './facetDefinitions';

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
