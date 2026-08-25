import { SearchBar } from '@globalise/design';
import Facets from './Facets';
import Selection from './Selection';
import SearchField from './SearchField';
import Results from './Results';
import classes from './Layout.module.css';

export default function Layout() {
  return (
    <div className={classes.search}>
      <div className={classes.searchHeader}>
        <SearchField/>
      </div>

      <div className={classes.facetSearch}>
        <SearchBar aria-label="Search within filters" placeholder="Search the properties"
          size="sm" variant="subtle" isDisabled/>
      </div>

      <div className={classes.facets}>
        <Facets/>
      </div>

      <div className={classes.selectionSlot}>
        <Selection/>
      </div>

      <div className={classes.resultList}>
        <Results/>
      </div>
    </div>
  );
}
