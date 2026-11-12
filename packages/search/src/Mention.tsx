import { Link } from 'react-aria-components';
import { toHref, useSearch } from '@globalise/router';
import { Highlight } from '@knaw-huc/faceted-search-react';
import { toManifestId } from '@globalise/common/document';
import { POST_TAG, PRE_TAG } from './elasticsearch/highlightTags';
import classes from './Mention.module.css';

import type { DocumentSearchResult } from './elasticsearch/search.server';

type MentionProps = {
  document: DocumentSearchResult;
  snippet: string;
};

export default function Mention({ document, snippet }: MentionProps) {
  const urlParams = useSearch({ from: '/search' });
  return (
    <li className={classes.mention}>
      <Link
        href={toHref({
          to: '/manifest',
          search: {
            ...urlParams,
            manifest: toManifestId(document.inventoryNumber),
            document: document.name,
            documentId: document.id,
            snippet,
          },
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
