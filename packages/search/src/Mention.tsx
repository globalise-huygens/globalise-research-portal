import { Link } from 'react-aria-components';
import { toViewerHref, useSearch } from '@globalise/router';
import { Highlight } from '@knaw-huc/faceted-search-react';
import { createManifestId, parseDocumentName } from '@globalise/common/uri';
import { POST_TAG, PRE_TAG } from './elasticsearch/highlightTags';
import classes from './Mention.module.css';

import type { DocumentSearchResult } from './elasticsearch/search.server';

type MentionProps = {
  document: DocumentSearchResult;
  snippet: string;
};

export default function Mention({ document, snippet }: MentionProps) {
  const urlParams = useSearch({ from: '/search' });
  const range = parseDocumentName(document.name);
  return (
    <li className={classes.mention}>
      <Link
        href={range && toViewerHref(range, {
          ...urlParams,
          manifest: createManifestId(range),
          document: document.name,
          documentId: document.id,
          snippet,
        })}
        className={classes.link}
      >
        <Highlight
          text={snippet}
          startMarker={PRE_TAG}
          endMarker={POST_TAG}
          render={(text) => <mark>{text}</mark>}
        />
      </Link>
    </li>
  );
}
