import { getContent, findByPath, label, LinkedArtNode } from '@globalise/common';
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
              ? works.map((work, j) => <RelationLink key={j} node={work}/>)
              : label(source)}
          </li>
        );
      })}
    </ul>
  );
}
