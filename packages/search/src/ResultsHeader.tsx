import QueryExpansion from './queryExpansion/QueryExpansion';
import classes from './ResultsHeader.module.css';

export default function ResultsHeader() {
  return (
    <div className={classes.resultsHeader}>
      <QueryExpansion/>
    </div>
  );
}
