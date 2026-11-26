import {
  findByPath,
  getLinkedArtEntityType,
  type LinkedArtNode,
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

export function ObjectCardPage() {
  const { uri } = route.useParams();

  const navigate = useNavigate();
  const client = useQueryClient();
  const [failure, setFailure] = useState<{ uri: string; error: Error }>();
  const isVoyage = getLinkedArtEntityType(uri) === 'voyage';

  useEffect(() => {
    let cancelled = false;
    async function openCard() {
      if (!isVoyage) {
        await loadObjectCard(uri);
        return;
      }
      const voyage = await client.query(entityResourceQueryOptions(uri));
      const destination = getVoyageDestination(voyage, uri);
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
  }, [uri, isVoyage, client, navigate]);

  if (failure?.uri === uri) {
    throw failure.error;
  }
  if (isVoyage) {
    return (
      <main className="object-card-page" aria-busy="true">
        Opening ship…
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

function getVoyageDestination(
  voyage: LinkedArtNode | null,
  uri: string,
): string {
  if (!voyage) {
    throw new Error('The voyage record could not be loaded.');
  }
  const ships = findByPath(voyage, ['moved']).filter(
    (node) => node.id && getLinkedArtEntityType(node.id) === 'ship',
  );
  const shipUris = [...new Set(ships.map((ship) => ship.id!))];
  if (shipUris.length !== 1) {
    throw new Error('This voyage must reference exactly one ship.');
  }
  const path = createObjectCardPath(shipUris[0]);
  const anchor = createObjectCardSplat(voyage.id ?? uri);
  if (!path || !anchor) {
    throw new Error('The voyage or ship URI could not be opened.');
  }
  return `${path}#${encodeURIComponent(anchor)}`;
}
