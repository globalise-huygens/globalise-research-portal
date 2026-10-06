import { useEffect, useRef, useTransition } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Highlight } from '@knaw-huc/faceted-search-react';
import { cn, Spinner } from '@globalise/design';
import { toManifestHref } from '@globalise/common/document';
import hitQueryOptions from './queries/hitQueryOptions';
import { POST_TAG, PRE_TAG } from './elasticsearch/highlightTags';
import classes from './Mention.module.css';

import type { DocumentSearchResult } from './elasticsearch/search.server';
import { Hit } from './elasticsearch/findSnippetHit.ts';

type MentionProps = {
  document: DocumentSearchResult;
  snippet: string;
};

export default function Mention({ document, snippet }: MentionProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isNavigatingToHit, startNavigatingToHit] = useTransition();
  const prefetchWait = useRef<number>(undefined);
  const hitOffsetsQuery = hitQueryOptions({ documentId: document.id, snippet });

  useEffect(() => () => clearTimeout(prefetchWait.current), []);

  function handleMouseEnter() {
    /**
     * Only fetch canvas offsets once the user hovers a mention for {@link prefetchDelay}
     */
    const prefetchDelay = 50;
    prefetchWait.current = window.setTimeout(
      () => void prefetchHitOffsets(),
      prefetchDelay,
    );
  }

  function handleMouseLeave() {
    clearTimeout(prefetchWait.current);
  }

  async function prefetchHitOffsets() {
    await queryClient.prefetchQuery(hitOffsetsQuery);
    console.log(`prefetched: ${snippet}`);
  }

  function handleClick() {
    if (isNavigatingToHit) {
      return;
    }
    startNavigatingToHit(async () => {
      const { name, inventoryNumber } = document;
      const hit: Hit | null = await queryClient.fetchQuery(hitOffsetsQuery);
      const href = toManifestHref({ inventoryNumber, document: name, hit });
      await navigate({ href });
    });
  }

  return (
    <li
      className={cn(classes.mention, isNavigatingToHit && classes.pending)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <span className={classes.snippet}>
        <Highlight
          text={snippet}
          startMarker={PRE_TAG}
          endMarker={POST_TAG}
          render={(text) => <mark>{text}</mark>}
        />
      </span>
      <Spinner className={classes.spinner}/>
    </li>
  );
}
