import { ReactNode } from 'react';
import { Button } from 'react-aria-components';
import { useSelectedFacets } from '@knaw-huc/faceted-search-react';
import classes from './Selection.module.css';

export default function Selection() {
  const [selectedFacets, clearFacets] = useSelectedFacets();

  return (
    <section className={classes.selection} aria-label="Selected filters">
      <div className={classes.label}>
        Selected filters:
      </div>

      <div className={classes.facets}>
        {selectedFacets.map((facet) =>
          <SelectedFacetItem key={facet.itemKey} {...facet}/>)}
      </div>

      <div>
        <Button className={classes.clear} onClick={clearFacets}>
          Clear filters
        </Button>
      </div>
    </section>
  );
}

function SelectedFacetItem({ name, label, onRemove }: {
  name?: string,
  label: ReactNode,
  onRemove: () => void,
}) {
  return (
    <div className={classes.facet}>
      <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
      </svg>

      <span>
        {name && <span className={classes.name}>{name}: </span>}{label}
      </span>

      <Button aria-label="Click to remove from search filters" onClick={onRemove}>
        &#10005;
      </Button>
    </div>
  );
}
