import { IconExternalLink } from '@globalise/design';
import { matchLabel, matchUri, SkosMatch } from './SkosModel.ts';

type MatchListProps = { title: string; matches?: SkosMatch[] };

export function MatchList({ title, matches }: MatchListProps) {
  if (!matches?.length) {
    return <h2 title="No data" className="inactive">{title}</h2>;
  }
  return (
    <>
      <h2>{title}</h2>
      <ul className="concept-list">
        {matches.map((match, i) => (
          <li key={i}>
            <a href={matchUri(match)} target="_blank" rel="noreferrer">
              {matchLabel(match)} <IconExternalLink className="inline-icon"/>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}