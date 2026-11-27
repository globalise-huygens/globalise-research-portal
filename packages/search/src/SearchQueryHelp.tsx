import { Button } from 'react-aria-components';
import { IconExpandSection } from '@globalise/design';
import classes from './SearchQueryHelp.module.css';

const topics = [
  {
    title: 'Where to search',
    rows: [
      { label: 'Transcription', queries: ['schip', 'goede hoop'] },
      {
        label: 'Document title',
        queries: ['title:missive', 'title:"generale missive"'],
        template: 'title:',
      },
      {
        label: 'Inventory number',
        queries: ['inventoryNumber:"1053"'],
        template: 'inventoryNumber:""',
      },
    ],
  },
  {
    title: 'What to search',
    note: 'If related words appear above the results, type one to search for it.',
    rows: [
      { label: 'Exact phrase', queries: ['"goede hoop"'] },
      { label: 'Word beginning or spelling variant', queries: ['missiv*', 'batavia~1'] },
      { label: 'Person mentions', queries: ['person:adriaan'], template: 'person:' },
      { label: 'Place mentions', queries: ['place:batavia'], template: 'place:' },
      { label: 'Object mentions', queries: ['humanmadeobject:batavia'], template: 'humanmadeobject:' },
      { label: 'Any person mention', queries: ['type:person'] },
      { label: 'Any object mention', queries: ['type:humanmadeobject'] },
    ],
  },
  {
    title: 'How to search',
    note: 'Use Filters to narrow results while keeping your search terms.',
    rows: [
      { label: 'Require both terms', queries: ['schip batavia', 'schip AND batavia'] },
      { label: 'Match either term', queries: ['schip OR schepen'] },
      { label: 'Group alternatives', queries: ['(schip OR schepen) AND batavia'] },
      { label: 'Exclude a term', queries: ['schip AND NOT batavia'] },
      { label: 'Allow up to five words between', queries: ['near(schip, batavia, 5)'] },
    ],
  },
] satisfies readonly {
  title: string;
  note?: string;
  rows: readonly { label: string; queries: readonly string[]; template?: string }[];
}[];

export default function SearchQueryHelp({
  id,
  open,
  onInsert,
}: {
  id: string;
  open: boolean;
  onInsert: (text: string, cursorOffset?: number) => void;
}) {
  const headingId = `${id}-heading`;

  return (
    <section id={id} className={classes.queryHelp} aria-labelledby={headingId} hidden={!open}>
      <h2 id={headingId}>Search query help</h2>
      <p>Choose an example or a blank field to insert it into your query.</p>
      <ul className={classes.topics} role="list">
        {topics.map(({ title, rows, note }) => (
          <li key={title}>
            <details>
              <summary>
                <span>{title}</span>
                <IconExpandSection width="20" height="20" aria-hidden="true"/>
              </summary>
              <dl className={classes.examples}>
                {rows.map(({ label, queries, template }) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>
                      {queries.map((query) => (
                        <Button
                          key={query}
                          className={classes.insert}
                          aria-label={`Insert example: ${query}`}
                          onPress={() => onInsert(query)}
                        >
                          <code>{query}</code>
                        </Button>
                      ))}
                      {template && (
                        <Button
                          className={classes.insert}
                          aria-label={`Insert blank field: ${label}`}
                          onPress={() => onInsert(
                            template,
                            template.endsWith('""') ? template.length - 1 : undefined,
                          )}
                        >
                          <code>{template}</code> <span>Blank</span>
                        </Button>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
              {note && <p className={classes.topicNote}>{note}</p>}
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}
