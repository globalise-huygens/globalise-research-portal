import { IconExpandSection } from '@globalise/design';
import classes from './SearchQueryHelp.module.css';

const topics = [
  {
    title: 'Where to search',
    rows: [
      { label: 'Transcription', queries: ['schip', 'goede hoop'] },
      { label: 'Document title', queries: ['title:missive', 'title:"generale missive"'] },
      { label: 'Inventory number', queries: ['inventoryNumber:"1053"'] },
    ],
  },
  {
    title: 'What to search',
    note: 'If related words appear above the results, type one to search for it.',
    rows: [
      { label: 'Exact phrase', queries: ['"goede hoop"'] },
      { label: 'Word beginning or spelling variant', queries: ['missiv*', 'batavia~1'] },
      { label: 'Person mentions', queries: ['person:adriaan'] },
      { label: 'Place mentions', queries: ['place:batavia'] },
      { label: 'Object mentions', queries: ['humanmadeobject:batavia'] },
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
  rows: readonly { label: string; queries: readonly string[] }[];
}[];

export default function SearchQueryHelp({ id, open }: { id: string; open: boolean }) {
  const headingId = `${id}-heading`;

  return (
    <section id={id} className={classes.queryHelp} aria-labelledby={headingId} hidden={!open}>
      <h2 id={headingId}>Search query help</h2>
      <ul className={classes.topics} role="list">
        {topics.map(({ title, rows, note }) => (
          <li key={title}>
            <details>
              <summary>
                <span>{title}</span>
                <IconExpandSection width="20" height="20" aria-hidden="true"/>
              </summary>
              <dl className={classes.examples}>
                {rows.map(({ label, queries }) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>
                      {queries.map((query) => <code key={query}>{query}</code>)}
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
