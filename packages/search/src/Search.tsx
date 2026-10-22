import { FacetedSearch, getReadableRange, type Facets } from '@knaw-huc/faceted-search-react';
import { facets } from './facetDefinitions';
import Layout from './Layout';

import '@globalise/design/styles.css';
import classes from './Search.module.css';

const facetsObj = facets.reduce<Facets>((acc, f) => {
  acc[f.key] = {
    label: f.label,
    valueRenderer: f.type === 'range' ? (value) => getReadableRange(value, false, '-') : undefined,
  };
  return acc;
}, {});

export default function Search({ autoFocus = false }: { autoFocus?: boolean }) {
  return (
    <div className={classes.search}>
      <FacetedSearch facets={facetsObj} pageSize={10} syncPageToUrl={false}>
        <Layout autoFocus={autoFocus} />
      </FacetedSearch>
    </div>
  );
}
