import {
  type DocumentState,
  findActiveSearchHits,
  findInitialCanvasId,
  setSearchHits,
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
  defaultInventory,
  getRouteApi,
  toCanvasHref,
  toManifestHref,
  useLocation,
} from '@globalise/router';
import { createManifestId, handle, idBase, parseViewerPath } from '@globalise/common/uri';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { findTextRanges, isEntity } from '@globalise/common/annotation';
import { asArray } from '@globalise/common';
import { ManifestClassifiedPreview } from './ManifestClassifiedPreview.tsx';
import { useSharableRouteState } from './share/useSharableRouteState';
import { createSharableHref } from './share/createSharableHref';
import { useResolveManifestRoute } from './share/useResolveManifestRoute';

const route = getRouteApi(`/${handle}/$`);

const collectionUrl = `${idBase}/inventory:collection`;

export function ManifestPage() {
  console.log(ManifestPage.name, 'href:', location.href);
  const navigate = route.useNavigate();
  const pathname = useLocation({ select: (location) => location.pathname });
  const viewer = useMemo(() => parseViewerPath(pathname) ?? defaultInventory, [pathname]);
  const isResolved = useResolveManifestRoute(viewer);
  const manifestUrl = createManifestId(viewer);
  const sharableRoute = useSharableRouteState(viewer);
  const searchState = getManifestSearchState(sharableRoute.searchHit, sharableRoute.searchHitQuery);
  const { data: highlights, isLoading: isHighlighting } = useQuery(
    highlightDocumentQueryOptions(searchState),
  );
  const activeHit = highlights?.hits
    .find((hit) => hit.esHitIndex === highlights.activeEsHitIndex);
  const activeHitCanvasId = activeHit?.canvasId;

  const initialCanvasId = findInitialCanvasId(sharableRoute.ref, activeHitCanvasId);

  let error: ErrorMessage | undefined = undefined;
  if (searchState && !activeHitCanvasId) {
    error = { message: 'Search result could not be located: showing first page in document.' };
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

  useEffect(logSearchHits, []);

  function logSearchHits() {
    return useDocumentStore.subscribe((state, prev) => {
      if (state.searchHits === prev.searchHits && state.activeEsHitIndex === prev.activeEsHitIndex) {
        return;
      }
      console.info('searchHits', state.searchHits, 'active', findActiveSearchHits(state));
    });
  }

  useEffect(storeSearchHits, [highlights]);

  function storeSearchHits() {
    setSearchHits(highlights?.hits ?? [], highlights?.activeEsHitIndex ?? null);
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

  function shareRoute() {
    const href = createSharableHref(sharableRoute);
    void navigator.clipboard.writeText(new URL(href, window.location.origin).href);
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
            onShare={shareRoute}
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
