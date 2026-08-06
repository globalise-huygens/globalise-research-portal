import {ReactNode} from 'react';
import {IconClose, IconEntityDocument} from '@globalise/design';
import {Button} from 'react-aria-components';
import {useSelectedFacets} from '@knaw-huc/faceted-search-react';
import classes from './Selection.module.css';

export default function Selection() {
  const [selectedFacets, clearFacets] = useSelectedFacets(false);

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

function SelectedFacetItem({name, label, onRemove}: {
  name?: string,
  label: ReactNode,
  onRemove: () => void,
}) {
  return (
    <div className={classes.facet}>
      <IconEntityDocument aria-hidden="true"/>

      <span>
        {name && <span className={classes.name}>{name}: </span>}{label}
      </span>

      <Button aria-label="Click to remove from search filters" onClick={onRemove}>
        <IconClose aria-hidden="true"/>
      </Button>
    </div>
  );
}
