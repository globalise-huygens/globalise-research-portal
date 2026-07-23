import { Panoptes, PanoptesConfiguration, useSearch } from '@knaw-huc/panoptes-react';
import { FacetedSearch, type Facets } from '@knaw-huc/faceted-search-react';
import setupWorker from './mock/serverMock';
import { facets } from './Facets';
import Layout from './Layout';
import classes from './Search.module.css';

const dataset = 'globalise';
const pageSize = 10;
const config: Partial<PanoptesConfiguration> = {
  url: 'https://globalise-panoptes',
  dataset,
  pageSize,
};

const facetsObj = facets.reduce<Facets>((acc, f) => {
  acc[f.key] = { label: f.label };
  return acc;
}, {});

await setupWorker.start();

export default function Search() {
  return (
    <div className={classes.search}>
      <Panoptes configuration={config}>
        <StateSetup/>
      </Panoptes>
    </div>
  );
}

function StateSetup() {
  const searchFn = useSearch(dataset);

  return (
    <FacetedSearch facets={facetsObj} searchFn={searchFn} pageSize={pageSize}>
      <Layout/>
    </FacetedSearch>
  );
}
