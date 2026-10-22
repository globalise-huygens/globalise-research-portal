import {
  type DocumentState,
  toDocumentHit,
  useDocumentStore,
} from '@globalise/common/document';
import {
  getManifestSearchState,
  highlightDocumentQueryOptions,
} from '@globalise/search';
import { Spinner } from '@globalise/design';
import { ManifestLoader } from '@globalise/facsimile';
import {
  ManifestDropdown,
  ManifestViewer,
  type ErrorMessage,
  useCollectionManifests,
} from '@globalise/manifest';
import { ViewerProvider } from '@knaw-huc/osd-iiif-viewer';
import { getRouteApi } from '@globalise/router';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { findTextRanges, isEntity } from '@globalise/common/annotation';
import { asArray } from '@globalise/common';
import { ManifestEntityPreview } from './ManifestEntityPreview.tsx';

const defaultManifest =
  'https://globalise-huygens.github.io/document-view-sandbox/iiif/manifest.json';

const route = getRouteApi('/manifest/');

const collectionUrl =
  'https://data.globalise.huygens.knaw.nl/' +
  'hdl:20.500.14722/inventory:collection';

export function ManifestPage() {
  const navigate = route.useNavigate();
  const search = route.useSearch();
  const manifestUrl = search.manifest ?? defaultManifest;
  const {
    data: highlights,
    isLoading: isHighlighting,
    isError: isHighlightError,
  } = useQuery(
    highlightDocumentQueryOptions(getManifestSearchState(search)),
  );
  const documentHit = search.document
    ? toDocumentHit(search.document, highlights?.snippet?.start ?? 0)
    : undefined;

  let error: ErrorMessage | undefined = undefined;
  if (isHighlightError) {
    error = { message: 'Search result could not be loaded.' };
  } else if (highlights && !highlights.snippet) {
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
      void navigate({
        search: { ...search, canvas: selectedCanvasId },
        replace: true,
      });
    });
  }

  useEffect(logHighlights, [highlights]);

  function logHighlights() {
    if (highlights) {
      console.info('highlights', highlights);
    }
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
    void navigate({ search: { ...search, manifest } });
  }

  return (
    <ViewerProvider>
      <ManifestLoader url={manifestUrl}>
        {isHighlighting ? <Spinner label="Loading search result"/> : (
          <ManifestViewer
            initialCanvasId={search.canvas}
            documentHit={documentHit}
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
