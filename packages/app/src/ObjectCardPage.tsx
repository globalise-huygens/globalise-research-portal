import {
  findByPath,
  getLinkedArtEntityType,
  type LinkedArtNode,
  type LinkedArtEntityType,
} from '@globalise/common';
import { useQueryClient } from '@tanstack/react-query';
import '@globalise/design/styles.css';
import './ObjectCardPage.css';
import { useEffect, useState } from 'react';
import { getRouteApi, useNavigate } from '@globalise/router';
import { Container, Grid } from '@globalise/design';
import {
  handle,
  createObjectCardPath,
  createObjectCardSplat,
} from '@globalise/common/uri';
import {
  loadObjectCard,
  ObjectCardView,
  entityResourceQueryOptions,
} from '@globalise/object-card';

const route = getRouteApi(`/${handle}/$`);

type RedirectTarget = {
  property: string;
  type: LinkedArtEntityType;
  label: string;
};
const redirectTargets: Partial<Record<LinkedArtEntityType, RedirectTarget>> = {
  voyage: { property: 'moved', type: 'ship', label: 'ship' },
  rulership: { property: 'had_subject_population', type: 'polity', label: 'polity' },
};

export function ObjectCardPage() {
  const { uri } = route.useParams();

  const navigate = useNavigate();
  const client = useQueryClient();
  const [failure, setFailure] = useState<{ uri: string; error: Error }>();
  const redirectTarget = redirectTargets[getLinkedArtEntityType(uri)];

  useEffect(() => {
    let cancelled = false;
    async function openCard() {
      if (!redirectTarget) {
        await loadObjectCard(uri);
        return;
      }
      const record = await client.query(entityResourceQueryOptions(uri));
      const destination = getRelatedCardDestination(record, uri, redirectTarget);
      if (!cancelled) {
        await navigate({ href: destination, replace: true });
      }
    }
    void openCard().catch((error: unknown) => {
      if (!cancelled) {
        setFailure({
          uri,
          error: error instanceof Error ? error : new Error(String(error)),
        });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [uri, redirectTarget, client, navigate]);

  if (failure?.uri === uri) {
    throw failure.error;
  }
  if (redirectTarget) {
    return (
      <main className="object-card-page" aria-busy="true">
        Opening {redirectTarget.label}…
      </main>
    );
  }

  return (
    <main className="object-card-page">
      <Container>
        <Grid>
          <div className="slot-content-band">
            <ObjectCardView />
          </div>
        </Grid>
      </Container>
    </main>
  );
}

function getRelatedCardDestination(
  record: LinkedArtNode | null,
  uri: string,
  target: RedirectTarget,
): string {
  if (!record) {
    throw new Error('The requested record could not be loaded.');
  }
  const related = findByPath(record, [target.property]).filter(
    (node) => node.id && getLinkedArtEntityType(node.id) === target.type,
  );
  const targetUris = [...new Set(related.map((node) => node.id!))];
  if (targetUris.length !== 1) {
    throw new Error(`This record must reference exactly one ${target.label}.`);
  }
  const path = createObjectCardPath(targetUris[0]);
  const anchor = createObjectCardSplat(record.id ?? uri);
  if (!path || !anchor) {
    throw new Error(`The record or ${target.label} URI could not be opened.`);
  }
  return `${path}#${encodeURIComponent(anchor)}`;
}
