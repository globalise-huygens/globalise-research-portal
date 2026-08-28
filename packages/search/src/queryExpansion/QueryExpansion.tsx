import { Suspense, useEffect } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useSearchFacet } from '@knaw-huc/faceted-search-react';
import { Button } from 'react-aria-components';
import { DialogTrigger, Popover } from 'react-aria-components/Popover';
import { Checkbox } from '@globalise/design';
import getQueryExpansionQueryOptions, {
  type QueryExpansion,
  type SourceExpansion,
} from './getQueryExpansionQueryOptions';
import { useTermSelection } from './TermSelectionProvider';
import classes from './QueryExpansion.module.css';

export default function QueryExpansion() {
  return (
    <Suspense>
      <QueryExpansionInner/>
    </Suspense>
  );
}

function QueryExpansionInner() {
  const { query } = useSearchFacet();
  const { updateQueryExpansion } = useTermSelection();
  const { data } = useSuspenseQuery(getQueryExpansionQueryOptions(query ?? ''));

  useEffect(() => updateQueryExpansion(data), [updateQueryExpansion, data]);

  const terms = Object.keys(data.terms);
  if (terms.length === 0) {
    return null;
  }

  return (
    <DialogTrigger>
      <Button className={classes.queryExpansion}>
        There are applied synonyms for the search term(s):
        <span className={classes.terms}> {terms.join(', ')}</span>
      </Button>

      <Popover>
        <TermsSelection queryExpansion={data}/>
      </Popover>
    </DialogTrigger>
  );
}

function TermsSelection({ queryExpansion }: { queryExpansion: QueryExpansion }) {
  return (
    <ul className={classes.termsSelection}>
      {Object.keys(queryExpansion.terms).map((term) =>
        <TermSelection key={term} term={term} sourceExpansions={queryExpansion.terms[term]}/>,
      )}
    </ul>
  );
}

function TermSelection({ term, sourceExpansions }: { term: string, sourceExpansions: SourceExpansion[] }) {
  const { termIsSelected, toggleTerm } = useTermSelection();
  const termState = termIsSelected(term);

  return (
    <li className={classes.selection}>
      <div className={classes.header}>
        <span className={classes.label}>Term:</span>
        <Checkbox name={term} className={classes.checkbox}
          isSelected={termState === 'all'} isIndeterminate={termState === 'some'}
          onChange={() => toggleTerm(term)}>
          {term}
        </Checkbox>
      </div>

      <ul>
        {sourceExpansions.map((sourceExpansion) =>
          <MethodsSelection key={`${term}_${sourceExpansion.source_id}`} term={term}
            sourceExpansion={sourceExpansion}/>,
        )}
      </ul>
    </li>
  );
}

function MethodsSelection({ term, sourceExpansion }: { term: string, sourceExpansion: SourceExpansion }) {
  const { sourceIsSelected, toggleSource } = useTermSelection();
  const sourceState = sourceIsSelected(term, sourceExpansion.source_id);

  return (
    <li className={classes.selection}>
      <div className={classes.header}>
        <span className={classes.label}>Method:</span>
        <Checkbox name={sourceExpansion.source_id} className={classes.checkbox}
          isSelected={sourceState === 'all'} isIndeterminate={sourceState === 'some'}
          onChange={() => toggleSource(term, sourceExpansion.source_id)}>
          {sourceExpansion.source_name}
        </Checkbox>
      </div>

      <ExpansionsSelection term={term} sourceExpansion={sourceExpansion}/>
    </li>
  );
}

function ExpansionsSelection({ term, sourceExpansion }: { term: string, sourceExpansion: SourceExpansion }) {
  const { isSelected, toggle } = useTermSelection();

  return (
    <ul className={classes.terms}>
      {sourceExpansion.expansions.map((expansion) =>
        <Checkbox name={expansion} className={classes.checkbox}
          isSelected={isSelected(term, sourceExpansion.source_id, expansion)}
          onChange={() => toggle(term, sourceExpansion.source_id, expansion)}>
          {expansion}
        </Checkbox>,
      )}
    </ul>
  );
}
