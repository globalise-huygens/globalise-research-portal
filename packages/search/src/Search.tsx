import { FacetedSearch, type Facets } from '@knaw-huc/faceted-search-react';
import { facets } from './Facets';
import Layout from './Layout';

import '@globalise/design/styles.css';
import classes from './Search.module.css';

const facetsObj = facets.reduce<Facets>((acc, f) => {
  acc[f.key] = { label: f.label };
  return acc;
}, {});

export default function Search() {
  return (
    <div className={classes.search}>
      <FacetedSearch facets={facetsObj} pageSize={10} syncPageToUrl={false}>
        <Layout/>
      </FacetedSearch>
    </div>
  );
}
