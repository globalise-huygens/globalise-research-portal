import QueryExpansion from './queryExpansion/QueryExpansion';
import { TermSelectionProvider } from './queryExpansion/TermSelectionProvider';
import classes from './ResultsHeader.module.css';

export default function ResultsHeader() {
  return (
    <div className={classes.resultsHeader}>
      <TermSelectionProvider>
        <QueryExpansion/>
      </TermSelectionProvider>
    </div>
  );
}
