import { ObjectCardExternalLink } from '@globalise/design';
import {
  getContent,
  findByPath,
  isUrl,
  label,
  type LinkedArtNode,
  url,
} from '@globalise/common';
import { isInternalUri } from '../isInternalUri.ts';
import { RelationLink } from './RelationLink.tsx';

type SourceListProps = {
  sources: LinkedArtNode[];
};

export function SourceList({ sources }: SourceListProps) {
  const items = sources
    .filter(isVisibleSource)
    .map((source, index) => {
      const sourceWorks = findByPath(source, ['part_of']);
      const visibleWorks = sourceWorks.filter(shouldShowSourceWork);
      const page = findByPath(source, ['identified_by'])
        .map(getContent)
        .filter((found) => !!found)
        .join(', ');
      const content = getContent(source);
      const sourceText = !sourceWorks.length && !isInternalUri(content)
        ? content || (!isInternalUri(source.id) ? source.id : undefined)
        : undefined;

      return (
        <li key={index}>
          {page && <span className="source-page">{page}</span>}
          {visibleWorks.length
            ? visibleWorks.map((work, workIndex) => {
              const sourceUrl = label(work);
              if (isUrl(sourceUrl) && !isInternalUri(sourceUrl)) {
                return (
                  <ObjectCardExternalLink key={workIndex} href={sourceUrl}>
                    {sourceUrl}
                  </ObjectCardExternalLink>
                );
              }
              return <RelationLink key={workIndex} node={work}/>;
            })
            : sourceText}
        </li>
      );
    });

  return items.length ? <ul className="source-list">{items}</ul> : null;
}

export function isVisibleSource(source: LinkedArtNode): boolean {
  const sourceWorks = findByPath(source, ['part_of']);
  const page = findByPath(source, ['identified_by'])
    .map(getContent)
    .some((found) => !!found);
  const content = getContent(source);
  const sourceText = !sourceWorks.length && !isInternalUri(content)
    ? content || (!isInternalUri(source.id) ? source.id : undefined)
    : undefined;
  return page || sourceWorks.some(shouldShowSourceWork) || !!sourceText;
}

function shouldShowSourceWork(work: LinkedArtNode): boolean {
  const sourceUrl = label(work);
  return isUrl(sourceUrl) && !isInternalUri(sourceUrl)
    ? true
    : !isInternalUri(url(work));
}
