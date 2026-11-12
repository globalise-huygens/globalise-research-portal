import { Link } from 'react-aria-components';
import { toViewerHref, useSearch } from '@globalise/router';
import { parseDocumentName } from '@globalise/common/uri';
import { MarkedText } from '@globalise/design';
import { isHit, parseAnnotatedText } from './elasticsearch/parseAnnotatedText';
import classes from './Mention.module.css';

import type { DocumentSearchResult } from './elasticsearch/search.server';

type MentionProps = {
  document: DocumentSearchResult;
  snippet: string;
};

export default function Mention({ document, snippet }: MentionProps) {
  const urlParams = useSearch({ from: '/search' });
  const range = parseDocumentName(document.name);
  const { plainText, segments } = parseAnnotatedText(snippet);
  return (
    <li className={classes.mention}>
      <Link
        href={range && toViewerHref(range, {
          ...urlParams,
          document: document.name,
          documentId: document.id,
          snippet: plainText,
        })}
        className={classes.link}
      >
        <MarkedText text={plainText} ranges={segments.filter(isHit)}/>
      </Link>
    </li>
  );
}
