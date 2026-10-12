import { useNavigate } from '@tanstack/react-router';
import { Highlight } from '@knaw-huc/faceted-search-react';
import { toManifestHref } from '@globalise/common/document';
import { POST_TAG, PRE_TAG } from './elasticsearch/highlightTags';
import classes from './Mention.module.css';

import type { DocumentSearchResult } from './elasticsearch/search.server';

type MentionProps = {
  document: DocumentSearchResult;
  snippet: string;
};

export default function Mention({ document, snippet }: MentionProps) {
  const navigate = useNavigate();

  function handleClick() {
    const href = toManifestHref({
      inventoryNumber: document.inventoryNumber,
      document: document.name,
      documentId: document.id,
      snippet,
      search: window.location.search,
    });
    void navigate({ href });
  }

  return (
    <li className={classes.mention} onClick={handleClick}>
      <Highlight
        text={snippet}
        startMarker={PRE_TAG}
        endMarker={POST_TAG}
        render={(text) => <mark>{text}</mark>}
      />
    </li>
  );
}
