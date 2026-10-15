import { Link } from '@tanstack/react-router';
import { Highlight, useSearchState } from '@knaw-huc/faceted-search-react';
import { DOCUMENT, DOCUMENT_ID, MANIFEST, SNIPPET, toManifestId } from '@globalise/common/document';
import { POST_TAG, PRE_TAG } from './elasticsearch/highlightTags';
import { toSearchSearch } from './url/searchSearch';
import classes from './Mention.module.css';

import type { DocumentSearchResult } from './elasticsearch/search.server';

type MentionProps = {
  document: DocumentSearchResult;
  snippet: string;
};

export default function Mention({ document, snippet }: MentionProps) {
  const state = useSearchState();

  const search = {
    ...toSearchSearch(state),
    [MANIFEST]: toManifestId(document.inventoryNumber),
    [DOCUMENT]: document.name,
    [DOCUMENT_ID]: document.id,
    [SNIPPET]: snippet,
  };

  return (
    <li className={classes.mention}>
      <Link to="/manifest" search={search} className={classes.link}>
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
