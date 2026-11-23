import Facets from './Facets';
import Selection from './Selection';
import SearchField from './SearchField';
import Results from './Results';
import ResultsHeader from './ResultsHeader';
import classes from './Layout.module.css';
import { TermSelectionProvider } from './queryExpansion/TermSelectionProvider';

export default function Layout({ autoFocus = false }: { autoFocus?: boolean }) {
  return (
    <TermSelectionProvider>
      <div className={classes.search}>
        <div className={classes.searchHeader}>
          <SearchField autoFocus={autoFocus} />
        </div>

        <div className={classes.facetSearch} aria-hidden="true"/>

        <div className={classes.facets}>
          <Facets/>
        </div>

        <div className={classes.selectionSlot}>
          <Selection/>
        </div>

        <div className={classes.resultList}>
          <ResultsHeader/>
          <Results/>
        </div>
      </div>
    </TermSelectionProvider>
  );
}
