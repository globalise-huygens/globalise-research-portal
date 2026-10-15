import {
  CANVAS,
  DOCUMENT,
  DOCUMENT_ID,
  type DocumentState,
  findActiveSearchHits,
  MANIFEST,
  setSearchHits,
  SNIPPET,
  toDocumentHit,
  useDocumentStore,
} from '@globalise/common/document';
import { getManifestSearchState, highlightDocumentQueryOptions } from '@globalise/search';
import { Spinner } from '@globalise/design';
import { ManifestLoader } from '@globalise/facsimile';
import {
  ManifestDropdown,
  ManifestViewer,
  type ErrorMessage,
  useCollectionManifests,
} from '@globalise/manifest';
import { ViewerProvider } from '@knaw-huc/osd-iiif-viewer';
import { useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { findTextRanges, isEntity } from '@globalise/common/annotation';
import { asArray } from '@globalise/common';
import { ManifestEntityPreview } from './ManifestEntityPreview.tsx';

const defaultManifest =
  'https://globalise-huygens.github.io/document-view-sandbox/iiif/manifest.json';

const collectionUrl =
  'https://data.globalise.huygens.knaw.nl/' +
  'hdl:20.500.14722/inventory:collection';


export function ManifestPage() {
  const navigate = useNavigate();
  const params = new URLSearchParams(typeof location === 'undefined' ? '' : location.search);
  const initialCanvasId = params.get(CANVAS) ?? undefined;
  const documentName = params.get(DOCUMENT);
  const { data: highlights, isLoading: isHighlighting, isError: isHighlightError } = useQuery(
    highlightDocumentQueryOptions(getManifestSearchState()),
  );
  const documentHit = documentName
    ? toDocumentHit(documentName, highlights?.snippet?.start ?? 0)
    : undefined;

  let error: ErrorMessage | undefined = undefined;
  if (isHighlightError) {
    error = { message: 'Search result could not be loaded.' };
  } else if (highlights && !highlights.snippet) {
    error = { message: 'Search result could not be located: showing first page in document.' };
  }

  const [manifestUrl, setManifestUrl] = useState(
    params.get(MANIFEST) ?? defaultManifest,
  );

  const allManifests = useCollectionManifests(collectionUrl);

  useEffect(syncCanvasParam, []);

  function syncCanvasParam() {
    return useDocumentStore.subscribe((state, prev) => {
      const { selectedCanvasId } = state;
      if (!selectedCanvasId || selectedCanvasId === prev.selectedCanvasId) {
        return;
      }
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set(CANVAS, selectedCanvasId);
      history.replaceState({}, '', newUrl);
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

  useEffect(navigateToObjectCard, []);

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
        navigate({ to: '/object-card', search: { uri } })
          .catch(console.error);
      }
    });
  }

  function handleManifestChange(url: string) {
    setManifestUrl(url);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set(MANIFEST, url);
    newUrl.searchParams.delete(CANVAS);
    newUrl.searchParams.delete(DOCUMENT);
    newUrl.searchParams.delete(DOCUMENT_ID);
    newUrl.searchParams.delete(SNIPPET);
    history.pushState({}, '', newUrl);
  }

  return (
    <ViewerProvider>
      <ManifestLoader url={manifestUrl}>
        {isHighlighting ? <Spinner label="Loading search result"/> : (
          <ManifestViewer
            canvasId={initialCanvasId}
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
