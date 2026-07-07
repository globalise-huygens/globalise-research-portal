import { useState } from 'react';
import { ViewerProvider } from '@knaw-huc/osd-iiif-viewer';
import { ManifestLoader } from '@globalise/facsimile';
import {
  ManifestCanvasNavigation,
  ManifestDocumentPageLayout,
  ManifestDropdown,
  ManifestFacsimileViewer,
  ManifestTranscriptionControls,
  ManifestTranscriptionViewer,
  useCollectionManifests,
} from '@globalise/manifest';
import { setSelectedCanvas, useDocumentStore } from '@globalise/common/document';

const defaultManifest = 'https://globalise-huygens.github.io/' +
  'document-view-sandbox/iiif/manifest.json';

const collectionUrl = 'https://data.globalise.huygens.knaw.nl/' +
  'hdl:20.500.14722/inventory:collection';

const MANIFEST = 'manifest';
const CANVAS = 'canvas';

/**
 * Sync selectedCanvas with url
 */
const params = new URLSearchParams(location.search);
const initialCanvasId = params.get(CANVAS) ?? undefined;

useDocumentStore.subscribe((state, prev) => {
  const { selectedCanvasId } = state;
  if (selectedCanvasId === prev.selectedCanvasId || !selectedCanvasId) {
    return;
  }
  const newUrl = new URL(window.location.href);
  newUrl.searchParams.set(CANVAS, selectedCanvasId);
  history.replaceState({}, '', newUrl);
});

export function ManifestDocumentPage() {
  const [manifestUrl, setManifestUrl] = useState(
    params.get(MANIFEST) ?? defaultManifest,
  );

  const allManifests = useCollectionManifests(collectionUrl);

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
        <ManifestDocumentPageLayout
          topLeft={
            <ManifestDropdown
              manifests={allManifests}
              selected={manifestUrl}
              onChange={handleManifestChange}
            />
          }
          topRight={<ManifestTranscriptionControls/>}
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
