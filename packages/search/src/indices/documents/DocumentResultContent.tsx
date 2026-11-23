import { cn } from '@globalise/design';
import Mention from '../../Mention';
import classes from '../../Result.module.css';
import type { DocumentSearchResult } from './documentsTypes';

export function DocumentResultContent({ result }: { result: DocumentSearchResult }) {
  return (
    <>
      <ul className={cn(classes.metadata, classes.archive)}>
        {result.archive.map((item, idx) => <li key={idx}>{item}</li>)}
      </ul>

      <ul className={classes.mentions}>
        {result.mentions.map((mention, idx) => <Mention
          key={idx}
          document={result}
          snippet={mention}/>,
        )}
      </ul>

      <pre>
        <code>
          {JSON.stringify(result, null, 2)}
        </code>
      </pre>
    </>
  );
}