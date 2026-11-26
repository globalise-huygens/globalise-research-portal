import {
  type DocumentState,
  type HtrHit,
  findActiveSearchHit,
  findInitialCanvasId,
  setSearchHits,
  toActiveHitIndex,
  useActiveHitIndex,
  useDocumentStore,
} from '@globalise/common/document';
import {
  getManifestSearchState,
  highlightDocumentQueryOptions,
} from '@globalise/search';
import { Spinner } from '@globalise/design';
import {
  ManifestDropdown,
  ManifestViewer,
  type ErrorMessage,
  useCollectionManifests,
  ManifestLoader,
} from '@globalise/manifest';
import { ViewerProvider } from '@knaw-huc/osd-iiif-viewer';
import {
  getRouteApi,
  toCanvasHref,
  toManifestHref,
} from '@globalise/router';
import { createManifestId, handle, idBase } from '@globalise/common/uri';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { findTextRanges, isEntity } from '@globalise/common/annotation';
import { asArray } from '@globalise/common';
import { ManifestClassifiedPreview } from './ManifestClassifiedPreview.tsx';
import { useSharableRouteState } from './share/useSharableRouteState';
import { createShareLink } from './share/createShareLink';
import { shareLabels } from './share/shareLabels';
import { toManifestRoute } from './share/toManifestRoute';
import { useResolveManifestRoute } from './share/useResolveManifestRoute';

const route = getRouteApi(`/${handle}/inventory:{$}`);

const collectionUrl = `${idBase}/inventory:collection`;

const noHits: HtrHit[] = [];

export function ManifestPage() {
  const navigate = route.useNavigate();
  const viewer = route.useParams({ select: ({ viewer }) => viewer });
  const isResolved = useResolveManifestRoute(viewer);
  const manifestUrl = createManifestId(viewer);
  const sharableRoute = useSharableRouteState(viewer);
  const searchState = getManifestSearchState(sharableRoute.searchHit, sharableRoute.searchHitQuery);
  const { data: highlights, isLoading: isHighlighting } = useQuery(
    highlightDocumentQueryOptions(searchState),
  );
  const hits = highlights?.hits ?? noHits;
  const locatedHitIndex = highlights?.locatedHitIndex ?? null;
  const activeHitIndex = toActiveHitIndex(hits, locatedHitIndex);
  const activeHitCanvasId = findActiveSearchHit({ hits, activeHitIndex })?.canvasId ?? null;

  const initialCanvasId = findInitialCanvasId(sharableRoute.ref, activeHitCanvasId);
  const browsedHitIndex = useActiveHitIndex();
  const sharedRoute = toManifestRoute(sharableRoute, browsedHitIndex);
  const share = createShareLink(sharedRoute, window.location.origin, shareLabels[sharedRoute.type]);

  let error: ErrorMessage | undefined = undefined;
  if (searchState && locatedHitIndex === null) {
    const showing = activeHitCanvasId ? 'first hit' : 'first page in document';
    error = { message: `Search result could not be located: showing ${showing}.` };
  }

  const allManifests = useCollectionManifests(collectionUrl);

  useEffect(syncCanvasParam, [navigate]);

  function syncCanvasParam() {
    return useDocumentStore.subscribe((state, prev) => {
      const { selectedCanvasId } = state;
      if (!selectedCanvasId || selectedCanvasId === prev.selectedCanvasId) {
        return;
      }
      const href = toCanvasHref(selectedCanvasId, {});
      if (href) {
        void navigate({ href, replace: true });
      }
    });
  }

  useEffect(storeSearchHits, [hits, activeHitIndex]);

  function storeSearchHits() {
    setSearchHits(hits, activeHitIndex);
  }

  useEffect(logTextRanges, []);

  function logTextRanges() {
    return useDocumentStore.subscribe((state, prev) => {
      const annotations = findSelectedAnnotations(state);
      if (!annotations || annotations === findSelectedAnnotations(prev)) {
        return;
      }
      console.info('textRanges', state.selectedCanvasId, findTextRanges(annotations));
    });
  }

  useEffect(navigateToObjectCard, [navigate]);

  function navigateToObjectCard() {
    return useDocumentStore.subscribe((state, prev) => {
      const currentClickedId = state.clicked?.id;
      const prevClickedId = prev.clicked?.id;
      if (!currentClickedId || currentClickedId === prevClickedId) {
        return;
      }
      const selectedCanvasId = state.selectedCanvasId;
      const canvasAnnotations = selectedCanvasId
        ? state.canvases[selectedCanvasId].annotations
        : undefined;
      const clickedAnno = canvasAnnotations
        ? canvasAnnotations[currentClickedId]
        : undefined;
      const entity = (clickedAnno && isEntity(clickedAnno))
        ? clickedAnno
        : undefined;
      const entityBody = entity
        ? asArray(entity.body)[0]
        : undefined;
      const ascribes_classification = entityBody?.ascribes_classification;
      const uri = ascribes_classification?.id;
      if (uri) {
        void navigate({ to: '/object-card', search: { uri } });
      }
    });
  }

  function handleManifestChange(manifest: string) {
    const href = toManifestHref(manifest, {});
    if (href) {
      void navigate({ href });
    }
  }

  return (
    <ViewerProvider>
      <ManifestLoader url={manifestUrl} canvasId={initialCanvasId}>
        {!isResolved || isHighlighting ? <Spinner label="Loading search result"/> : (
          <ManifestViewer
            initialCanvasId={initialCanvasId}
            error={error}
            share={share}
            onClose={() => void navigate({ to: '/' })}
            topLeft={
              <ManifestDropdown
                manifests={allManifests}
                selected={manifestUrl}
                onChange={handleManifestChange}
              />
            }
          />
        )}
        <ManifestClassifiedPreview/>
      </ManifestLoader>
    </ViewerProvider>
  );
}

function findSelectedAnnotations(state: DocumentState) {
  const { selectedCanvasId, canvases } = state;
  return selectedCanvasId ? canvases[selectedCanvasId]?.annotations : undefined;
}
