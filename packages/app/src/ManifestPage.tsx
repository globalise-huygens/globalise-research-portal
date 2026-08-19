import { setSelectedCanvas, useDocumentStore } from '@globalise/common/document';
import { ManifestLoader } from '@globalise/facsimile';
import {
  ManifestCanvasNavigation,
  ManifestViewer,
  ManifestDropdown,
  ManifestFacsimileViewer,
  ManifestTranscriptionViewer,
  useCollectionManifests,
} from '@globalise/manifest';
import { ViewerProvider } from '@knaw-huc/osd-iiif-viewer';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { isEntity } from '@globalise/common/annotation';
import { asArray } from '@globalise/common';

const defaultManifest =
  'https://globalise-huygens.github.io/document-view-sandbox/iiif/manifest.json';

const collectionUrl =
  'https://data.globalise.huygens.knaw.nl/' +
  'hdl:20.500.14722/inventory:collection';

const MANIFEST = 'manifest';
const CANVAS = 'canvas';

export function ManifestPage() {
  const navigate = useNavigate();
  const params = new URLSearchParams(typeof location === 'undefined' ? '' : location.search);
  const initialCanvasId = params.get(CANVAS) ?? undefined;
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

  useEffect(navigateToObjectCard, []);

  function navigateToObjectCard() {
    return useDocumentStore.subscribe((state, prev) => {
      const currentClickedId = state.clickedId;
      const prevClickedId = prev.clickedId;
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
    history.pushState({}, '', newUrl);
  }

  return (
    <ViewerProvider>
      <ManifestLoader url={manifestUrl}>
        <ManifestViewer
          onClose={() => void navigate({ to: '/' })}
          topLeft={
            <ManifestDropdown
              manifests={allManifests}
              selected={manifestUrl}
              onChange={handleManifestChange}
            />
          }
          scan={
            <ManifestFacsimileViewer
              initialCanvasId={initialCanvasId}
              onCanvasChange={(id) => setSelectedCanvas(id, 'facsimile')}
            />
          }
          transcription={
            <ManifestTranscriptionViewer
              initialCanvasId={initialCanvasId}
              onCanvasChange={(id) => setSelectedCanvas(id, 'transcription')}
            />
          }
          bottom={<ManifestCanvasNavigation/>}
        />
      </ManifestLoader>
    </ViewerProvider>
  );
}
