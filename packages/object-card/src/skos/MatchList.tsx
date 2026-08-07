import { ObjectCardExternalLink } from '@globalise/design';
import { matchLabel, matchUri, SkosMatch } from './SkosModel.ts';

type MatchListProps = { title: string; matches?: SkosMatch[] };

export function MatchList({ title, matches }: MatchListProps) {
  if (!matches?.length) {
    return null;
  }

  return (
    <section className="match-group">
      <h4 className="match-title">{title}</h4>
      <div className="match-list">
        {matches.map((match, i) => (
          <ObjectCardExternalLink key={i} href={matchUri(match)}>
            {matchLabel(match)}
          </ObjectCardExternalLink>
        ))}
      </div>
    </section>
  );
}
