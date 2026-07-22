import { Suspense, ReactNode } from 'react';
import { FilterFacetProvider, useFilterFacetContext } from '@knaw-huc/faceted-search-react';
import Facet from './Facet';
import GhostLines from './GhostLines';

export default function FilterFacet({ facetKey, children }: { facetKey: string, children: ReactNode }) {
  return (
    <FilterFacetProvider facetKey={facetKey}>
      <FilterFacetInner children={children}/>
    </FilterFacetProvider>
  );
}

function FilterFacetInner({ children }: { children: ReactNode }) {
  const { label } = useFilterFacetContext();
  
  return (
    <Facet label={label}>
      <Suspense fallback={<GhostLines/>}>
        {children}
      </Suspense>
    </Facet>
  );
}
