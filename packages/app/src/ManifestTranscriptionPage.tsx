import { useState } from 'react';
import { ViewerProvider } from '@knaw-huc/osd-iiif-viewer';
import { ManifestLoader } from '@globalise/facsimile';
import { Page } from './Page.tsx';
import {
  useCollectionManifests,
  ManifestDropdown,
  ManifestTranscriptionControls,
  ManifestTranscriptionViewer,
} from '@globalise/manifest';

const defaultManifest = 'https://globalise-huygens.github.io/' +
  'document-view-sandbox/iiif/manifest.json';

const collectionUrl = 'https://data.globalise.huygens.knaw.nl/' +
  'hdl:20.500.14722/inventory:collection';

const MANIFEST = 'manifest';
const CANVAS = 'canvas';

export function ManifestTranscriptionPage() {
  const params = new URLSearchParams(location.search);

  const [manifestUrl, setManifestUrl] = useState(
    params.get(MANIFEST) ?? defaultManifest,
  );
  const initialCanvasId = params.get(CANVAS) ?? undefined;
  const allManifests = useCollectionManifests(collectionUrl);

  function handleManifestChange(url: string) {
    setManifestUrl(url);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set(MANIFEST, url);
    newUrl.searchParams.delete(CANVAS);
    history.pushState({}, '', newUrl);
  }

  function handleCanvasChange(canvasId: string) {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set(CANVAS, canvasId);
    history.replaceState({}, '', newUrl);
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
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflow: 'hidden',
          }}>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <ManifestTranscriptionViewer
                initialCanvasId={initialCanvasId}
                onCanvasChange={handleCanvasChange}
              />
            </div>
          </div>
        </Page>
      </ManifestLoader>
    </ViewerProvider>
  );
}