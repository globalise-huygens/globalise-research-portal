import { useState } from 'react';
import { ViewerProvider } from '@knaw-huc/osd-iiif-viewer';
import { ManifestLoader } from '@globalise/facsimile';
import { Page } from './Page.tsx';
import {
  ManifestDropdown,
  ManifestFacsimileViewer,
  ManifestTranscriptionControls,
  ManifestTranscriptionViewer,
  useCollectionManifests,
} from '@globalise/manifest';
import { SplitPaneLayout } from '@globalise/document';
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
const initialCanvas = Number(params.get(CANVAS)) || 0;
setSelectedCanvas(initialCanvas, 'external');
useDocumentStore.subscribe((state, prev) => {
  const selectedCanvas = state.selectedCanvas;
  if (selectedCanvas === prev.selectedCanvas) {
    return;
  }
  const newUrl = new URL(window.location.href);
  newUrl.searchParams.set(CANVAS, String(selectedCanvas));
  history.replaceState({}, '', newUrl);
});

export function ManifestDocumentPage() {
  console.log(new Date().toISOString(), 'render', ManifestDocumentPage.name);

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
        <Page
          header={
            <>
              <div style={{ flex: 1, minWidth: 0 }}>
                <ManifestDropdown
                  manifests={allManifests}
                  selected={manifestUrl}
                  onChange={handleManifestChange}
                />
              </div>
              <div style={{
                flex: '0 0 auto',
                display: 'flex',
                gap: '0.25rem',
                alignItems: 'center',
              }}>
                <ManifestTranscriptionControls/>
              </div>
            </>
          }
        >
          <SplitPaneLayout>
            <ManifestFacsimileViewer
              initialCanvas={initialCanvas}
              onCanvasChange={(index) => setSelectedCanvas(index, 'facsimile')}
            />
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100vh',
              overflow: 'hidden',
            }}>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <ManifestTranscriptionViewer
                  initialCanvas={initialCanvas}
                  onCanvasChange={(index) => setSelectedCanvas(index, 'transcription')}
                />
              </div>
            </div>
          </SplitPaneLayout>
        </Page>
      </ManifestLoader>
    </ViewerProvider>
  );
}