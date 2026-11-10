import { Link } from 'react-aria-components';
import { toViewerHref, useSearch } from '@globalise/router';
import { createManifestId, parseDocumentName } from '@globalise/common/uri';
import { isHit, parseAnnotatedText } from './elasticsearch/parseAnnotatedText';
import classes from './Mention.module.css';

import type { ReactNode } from 'react';
import type { AnnotatedText } from './elasticsearch/parseAnnotatedText';
import type { DocumentSearchResult } from './elasticsearch/search.server';

type MentionProps = {
  document: DocumentSearchResult;
  snippet: string;
};

export default function Mention({ document, snippet }: MentionProps) {
  const urlParams = useSearch({ from: '/search' });
  const range = parseDocumentName(document.name);
  const annotatedSnippet = parseAnnotatedText(snippet);
  return (
    <li className={classes.mention}>
      <Link
        href={range && toViewerHref(range, {
          ...urlParams,
          manifest: createManifestId(range),
          document: document.name,
          documentId: document.id,
          snippet: annotatedSnippet.plainText,
        })}
        className={classes.link}
      >
        {markHits(annotatedSnippet)}
      </Link>
    </li>
  );
}

function markHits({ plainText, segments }: AnnotatedText): ReactNode[] {
  const parts: ReactNode[] = [];
  let offset = 0;
  for (const { start, end } of segments.filter(isHit)) {
    parts.push(plainText.slice(offset, start), <mark key={start}>{plainText.slice(start, end)}</mark>);
    offset = end;
  }
  parts.push(plainText.slice(offset));
  return parts;
}
