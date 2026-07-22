import { IconExternalLink } from '@globalise/design';

type MatchListProps = { title: string; matches?: string[] };

export function MatchList({ title, matches }: MatchListProps) {
  if (!matches?.length) {
    return <h2 title="No data" className="inactive">{title}</h2>;
  }
  return (
    <>
      <h2>{title}</h2>
      <ul className="concept-list">
        {matches.map((match) => (
          <li key={match}>
            <a href={match} target="_blank">
              {match} <IconExternalLink className="inline-icon"/>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}