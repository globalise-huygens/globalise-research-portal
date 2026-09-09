import { ObjectCardExternalLink } from '@globalise/design';
import {
  asArray,
  getContent,
  findByPath,
  getValues,
  isLinkedArtNode,
  isUrl,
  label,
  type LinkedArtNode,
  url,
} from '@globalise/common';
import { isInternalUri } from '../isInternalUri.ts';
import { RelationLink } from './RelationLink.tsx';

type SourceListProps = {
  includeInternalLabels?: boolean;
  showNotes?: boolean;
  sources: LinkedArtNode[];
};

export function SourceList({
  includeInternalLabels = false,
  showNotes = false,
  sources,
}: SourceListProps) {
  const items = sources
    .filter((source) => isVisibleSource(source, includeInternalLabels))
    .map((source, index) => {
      const sourceWorks = findByPath(source, ['part_of']);
      const visibleWorks = sourceWorks.filter((work) =>
        shouldShowSourceWork(work, includeInternalLabels),
      );
      const page = findByPath(source, ['identified_by'])
        .map(getContent)
        .filter((found) => !!found)
        .join(', ');
      const sourceText = getSourceText(
        source,
        sourceWorks.length > 0,
        includeInternalLabels,
      );
      const notes = showNotes ? getNotes(source) : [];

      return (
        <li key={index}>
          <span className="source-citation">
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
                if (includeInternalLabels && isInternalUri(work.id)) {
                  return <span key={workIndex}>{label(work)}</span>;
                }
                return <RelationLink key={workIndex} node={work}/>;
              })
              : sourceText}
          </span>
          {notes.map((note) => (
            <span key={note} className="source-note">{note}</span>
          ))}
        </li>
      );
    });

  return items.length ? <ul className="source-list">{items}</ul> : null;
}

export function isVisibleSource(
  source: LinkedArtNode,
  includeInternalLabels = false,
): boolean {
  const sourceWorks = findByPath(source, ['part_of']);
  const page = findByPath(source, ['identified_by'])
    .map(getContent)
    .some((found) => !!found);
  const sourceText = getSourceText(
    source,
    sourceWorks.length > 0,
    includeInternalLabels,
  );
  return page
    || sourceWorks.some((work) =>
      shouldShowSourceWork(work, includeInternalLabels),
    )
    || !!sourceText;
}

export function getNotes(node: LinkedArtNode): string[] {
  return [...new Set(
    asArray(node.note).flatMap((note) => {
      if (!isLinkedArtNode(note)) {
        return getValues(note);
      }
      return [
        ...getValues(note.content),
        ...getValues(note.value),
        ...getValues(note._label),
      ];
    }).filter((note) => !!note),
  )];
}

function getSourceText(
  source: LinkedArtNode,
  hasSourceWorks: boolean,
  includeInternalLabels: boolean,
): string | undefined {
  if (hasSourceWorks) {
    return undefined;
  }
  const content = getContent(source);
  if (content && !isInternalUri(content)) {
    return content;
  }
  if (!isInternalUri(source.id)) {
    return source.id;
  }
  return includeInternalLabels ? label(source) || 'Internal source' : undefined;
}

function shouldShowSourceWork(
  work: LinkedArtNode,
  includeInternalLabels: boolean,
): boolean {
  const sourceUrl = label(work);
  return isUrl(sourceUrl) && !isInternalUri(sourceUrl)
    ? true
    : !isInternalUri(url(work)) || includeInternalLabels && !!label(work);
}
