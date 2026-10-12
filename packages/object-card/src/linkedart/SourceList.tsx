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
import { RelationLink, RelationValue } from './RelationLink.tsx';
import { getRelationValue } from './RelationValueModel.ts';

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
    .filter((source) => isVisibleSource(source, includeInternalLabels, showNotes))
    .map((source, index) => {
      const sourceWorks = findByPath(source, ['part_of']);
      const visibleWorks = sourceWorks.filter(shouldShowSourceWork);
      const identifiers = getSourceIdentifiers(source);
      const sourceText = getSourceText(
        source,
        sourceWorks.length > 0,
        identifiers.length > 0,
        includeInternalLabels,
      );
      const notes = showNotes ? getNotes(source) : [];
      const content = getContent(source);
      const separateContent = isReadableSourceText(content)
        && (identifiers.length > 0 || visibleWorks.length > 0)
        && !identifiers.some((identifier) => identifier.value === content)
        && !visibleWorks.some((work) => getRelationValue(work) === content);

      return (
        <li key={index}>
          <span className="source-citation">
            {identifiers.map(({ value, types }, identifierIndex) => (
              <span key={identifierIndex} className="source-identifier">
                {types.length
                  ? types.map((type, typeIndex) => (
                    <span key={typeIndex}>
                      {typeIndex > 0 && ', '}
                      <RelationLink node={type}/>
                    </span>
                  ))
                  : 'Identifier'}
                {value && <>: {isUrl(value) && !isInternalUri(value)
                  ? <ObjectCardExternalLink href={value}>{value}</ObjectCardExternalLink>
                  : <CitationText text={value}/>}</>}
              </span>
            ))}
            {visibleWorks.length
              ? visibleWorks.map((work, workIndex) => {
                const sourceUri = getSourceWorkUri(work);
                return (
                  <span key={workIndex}>
                    <RelationValue
                      node={sourceUri ? { ...work, id: sourceUri } : work}
                      render={(text) => <>
                        <CitationText text={text}/>
                        {sourceUri && !text.toLowerCase().includes(sourceUri.toLowerCase()) && <>
                          {' '}<ObjectCardExternalLink href={sourceUri}>{sourceUri}</ObjectCardExternalLink>
                        </>}
                      </>}
                    />
                  </span>
                );
              })
              : !identifiers.length && sourceText && <CitationText text={sourceText}/>}
          </span>
          {separateContent && <span className="source-citation"><CitationText text={content}/></span>}
          {notes.map((note) => (
            <span key={note} className="source-note"><CitationText text={note}/></span>
          ))}
        </li>
      );
    });

  return items.length ? <ul className="source-list">{items}</ul> : null;
}

// Keep bibliography prose plain; only URLs and DOI identifiers are links.
function CitationText({ text }: { text: string }) {
  const matches = [...text.matchAll(/https?:\/\/[^\s<>“”"]+|\b10\.\d{4,9}\/[^\s<>“”"]+/gi)];
  let offset = 0;
  const parts = matches.map((match) => {
    let value = match[0].replace(/[.,;:!?]+$/, '');
    // Exclude prose parentheses, retaining balanced parentheses inside DOI URLs.
    let unmatchedClosings = (value.match(/\)/g)?.length ?? 0) - (value.match(/\(/g)?.length ?? 0);
    while (value.endsWith(')') && unmatchedClosings > 0) {
      value = value.slice(0, -1);
      unmatchedClosings--;
    }
    const preceding = text.slice(offset, match.index);
    offset = match.index + value.length;
    const href = /^https?:/i.test(value) ? value.replace(/^https?:/i, (scheme) => scheme.toLowerCase()) : `https://doi.org/${value}`;
    return <span key={match.index}>{preceding}<ObjectCardExternalLink href={href}>{value}</ObjectCardExternalLink></span>;
  });
  return <>{parts}{text.slice(offset)}</>;
}

export function isVisibleSource(
  source: LinkedArtNode,
  includeInternalLabels = false,
  showNotes = false,
): boolean {
  const sourceWorks = findByPath(source, ['part_of']);
  const identifiers = getSourceIdentifiers(source);
  const sourceText = getSourceText(
    source,
    sourceWorks.length > 0,
    identifiers.length > 0,
    includeInternalLabels,
  );
  return identifiers.length > 0
    || sourceWorks.some(shouldShowSourceWork)
    || !!sourceText
    || showNotes && getNotes(source).some(isReadableSourceText);
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
    }).filter(isReadableSourceText),
  )];
}

function getSourceText(
  source: LinkedArtNode,
  hasSourceWorks: boolean,
  hasIdentifiers: boolean,
  includeInternalLabels: boolean,
): string | undefined {
  const content = getContent(source);
  if (isReadableSourceText(content)) {
    return content;
  }
  if (hasSourceWorks || hasIdentifiers) {
    return undefined;
  }
  if (isUrl(source.id) && !isInternalUri(source.id)) {
    return source.id;
  }
  const sourceLabel = label(source);
  return (!isInternalUri(source.id) || includeInternalLabels) && isReadableSourceText(sourceLabel)
    ? sourceLabel
    : undefined;
}

function getSourceIdentifiers(source: LinkedArtNode) {
  return findByPath(source, ['identified_by'])
    .map((identifier) => ({
      value: getContent(identifier),
      types: findByPath(identifier, ['classified_as']),
    }))
    .filter(({ value }) => isReadableSourceText(value));
}

function isReadableSourceText(text?: string): boolean {
  return !!text?.trim() && !text.trim().startsWith('_:')
    && !text.trim().startsWith('vocop_obs_') && !isInternalUri(text);
}

function getSourceWorkUri(work: LinkedArtNode): string | undefined {
  const identifierUri = findByPath(work, ['identified_by'])
    .filter((identifier) => identifier.type === 'Identifier')
    .map(getContent)
    .find(isUrl);
  const legacyLabel = label(work);
  return url(work) ?? identifierUri ?? (isUrl(legacyLabel) ? legacyLabel : undefined);
}

function shouldShowSourceWork(work: LinkedArtNode): boolean {
  const value = getRelationValue(work);
  return !!getSourceWorkUri(work)
    || value !== work.type && isReadableSourceText(value);
}
