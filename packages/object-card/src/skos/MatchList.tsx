import { ObjectCardExternalLink, ObjectCardSection } from '@globalise/design';
import { matchLabel, matchUri, SkosMatch } from './SkosModel.ts';

type MatchListProps = { title: string; matches?: SkosMatch[] };

export function MatchList({ title, matches }: MatchListProps) {
  if (!matches?.length) {
    return <ObjectCardSection title={title} className="inactive"/>;
  }
  return (
    <ObjectCardSection title={title}>
      {matches.map((match, i) => (
        <ObjectCardExternalLink key={i} href={matchUri(match)}>
          {matchLabel(match)}
        </ObjectCardExternalLink>
      ))}
    </ObjectCardSection>
  );
}