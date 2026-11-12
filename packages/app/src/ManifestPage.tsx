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
import { getRouteApi, toCanvasHref, toManifestHref } from '@globalise/router';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { findTextRanges, getEventId, isEntity, isEvent } from '@globalise/common/annotation';
import { asArray } from '@globalise/common';
import { ManifestEntityPreview } from './ManifestEntityPreview.tsx';

const defaultManifest =
  'https://data.globalise.huygens.knaw.nl/hdl:20.500.14722/inventory:1053.manifest';

const route = getRouteApi('/hdl:20.500.14722/$');

const collectionUrl =
  'https://data.globalise.huygens.knaw.nl/' +
  'hdl:20.500.14722/inventory:collection';

export function ManifestPage() {
  const navigate = route.useNavigate();
  const search = route.useSearch();
  const manifestUrl = search.manifest ?? defaultManifest;
  const searchState = getManifestSearchState(search);
  const { data: highlights, isLoading: isHighlighting } = useQuery(
    highlightDocumentQueryOptions(searchState),
  );
  const activeHit = highlights?.hits
    .find((hit) => hit.esHitIndex === highlights.activeEsHitIndex);
  const activeHitCanvasId = activeHit?.canvasId;

  const initialCanvasId = findInitialCanvasId(search, activeHitCanvasId);

  let error: ErrorMessage | undefined = undefined;
  if (searchState && !activeHitCanvasId) {
    error = { message: 'Search result could not be located: showing first page in document.' };
  }

  const allManifests = useCollectionManifests(collectionUrl);

  useEffect(syncCanvasParam, [navigate, search]);

  function syncCanvasParam() {
    return useDocumentStore.subscribe((state, prev) => {
      const { selectedCanvasId } = state;
      if (!selectedCanvasId || selectedCanvasId === prev.selectedCanvasId) {
        return;
      }
      const href = toCanvasHref(selectedCanvasId, { ...search, canvas: selectedCanvasId });
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

  // TODO: remove when clicking an event opens its preview
  useEffect(alertClickedEvent, []);

  function alertClickedEvent() {
    return useDocumentStore.subscribe((state, prev) => {
      if (!state.clicked || state.clicked === prev.clicked) {
        return;
      }
      const annotation = findSelectedAnnotations(state)?.[state.clicked.id];
      if (annotation && isEvent(annotation)) {
        alert(getEventId(annotation));
      }
    });
  }

  function handleManifestChange(manifest: string) {
    const href = toManifestHref(manifest, { ...search, manifest });
    if (href) {
      void navigate({ href });
    }
  }

  return (
    <ViewerProvider>
      <ManifestLoader url={manifestUrl} canvasId={initialCanvasId}>
        {isHighlighting ? <Spinner label="Loading search result"/> : (
          <ManifestViewer
            initialCanvasId={initialCanvasId}
            error={error}
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
        <ManifestEntityPreview/>
      </ManifestLoader>
    </ViewerProvider>
  );
}

function findSelectedAnnotations(state: DocumentState) {
  const { selectedCanvasId, canvases } = state;
  return selectedCanvasId ? canvases[selectedCanvasId]?.annotations : undefined;
}
