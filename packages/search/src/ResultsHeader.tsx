import { usePagination } from '@knaw-huc/faceted-search-react';
import QueryExpansion from './queryExpansion/QueryExpansion';
import { TermSelectionProvider } from './queryExpansion/TermSelectionProvider';
import classes from './ResultsHeader.module.css';

export default function ResultsHeader() {
  return (
    <div className={classes.resultsHeader}>
      <TotalResults/>

      <TermSelectionProvider>
        <QueryExpansion/>
      </TermSelectionProvider>

      <div></div>
    </div>
  );
}

function TotalResults() {
  const { total } = usePagination();

  return (
    <span>Showing {total.toLocaleString()} results</span>
  );
}
