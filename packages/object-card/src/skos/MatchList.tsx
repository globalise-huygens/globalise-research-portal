import { ObjectCardExternalLink } from '@globalise/design';
import { matchLabel, matchUri, SkosMatch } from './SkosModel.ts';

type MatchListProps = { title: string; matches?: SkosMatch[] };

export function MatchList({ title, matches }: MatchListProps) {
  if (!matches?.length) {
    return null;
  }

  return (
    <section className="match-group">
      <h4>{title}</h4>
      <div className="match-list">
        {matches.map((match, i) => {
          const uri = matchUri(match);
          return (
            <ObjectCardExternalLink key={i} href={uri}>
              {getExternalLabel(matchLabel(match), uri)}
            </ObjectCardExternalLink>
          );
        })}
      </div>
    </section>
  );
}

function getExternalLabel(label: string, uri: string): string {
  if (label !== uri) {
    return label;
  }

  try {
    const url = new URL(uri);
    const hostname = url.hostname
      .replace(/^www\./, '')
      .replace(/^vocab\./, '');
    const domain = hostname.split('.').slice(-2).join('.');
    const identifier = url.pathname.split('/').filter(Boolean).at(-1);

    if (domain === 'wikidata.org' && identifier) {
      return `wikidata/${identifier.replace(/^Q/, '')}`;
    }

    return domain;
  } catch {
    return label;
  }
}
