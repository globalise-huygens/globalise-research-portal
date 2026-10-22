import { FacetedSearch, getReadableRange, type Facets } from '@knaw-huc/faceted-search-react';
import { facets, getRouteApi } from '@globalise/router';
import Layout from './Layout';
import { toSearchState, toSearchUrlParams } from './url';

import '@globalise/design/styles.css';
import classes from './Search.module.css';

const route = getRouteApi('/search');

const facetsObj = facets.reduce<Facets>((acc, f) => {
  acc[f.key] = {
    label: f.label,
    valueRenderer: f.type === 'range' ? (value) => getReadableRange(value, false, '-') : undefined,
  };
  return acc;
}, {});

export default function Search() {
  const urlParams = route.useSearch();
  const navigate = route.useNavigate();

  return (
    <div className={classes.search}>
      <FacetedSearch
        facets={facetsObj}
        pageSize={10}
        state={toSearchState(urlParams)}
        onStateChange={(state) => void navigate({ search: toSearchUrlParams(state), replace: true })}
      >
        <Layout/>
      </FacetedSearch>
    </div>
  );
}
