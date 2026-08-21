import { ObjectCardExternalLink } from '@globalise/design';
import {
  getContent,
  findByPath,
  isUrl,
  label,
  LinkedArtNode,
} from '@globalise/common';
import { RelationLink } from './RelationLink.tsx';

type SourceListProps = {
  sources: LinkedArtNode[];
};

export function SourceList({ sources }: SourceListProps) {
  if (!sources.length) {
    return null;
  }
  return (
    <ul className="source-list">
      {sources.map((source, i) => {
        const works = findByPath(source, ['part_of']);
        const page = findByPath(source, ['identified_by'])
          .map(getContent)
          .filter((found) => !!found)
          .join(', ');
        return (
          <li key={i}>
            {page && <span className="source-page">p. {page}</span>}
            {works.length
              ? works.map((work, j) => {
                const sourceUrl = label(work);
                if (isUrl(sourceUrl)) {
                  return (
                    <ObjectCardExternalLink key={j} href={sourceUrl}>
                      {sourceUrl}
                    </ObjectCardExternalLink>
                  );
                }
                return <RelationLink key={j} node={work}/>;
              })
              : [getContent(source), source.id, source.type]
                .find((value) => !!value)}
          </li>
        );
      })}
    </ul>
  );
}
