import {useState} from 'react';
import {ViewerProvider} from '@knaw-huc/osd-iiif-viewer';
import {ManifestDropdown} from './dropdown/ManifestDropdown';
import {useCollectionManifests} from './dropdown/useCollectionManifests';
import {ManifestLoader} from './ManifestLoader';
import {ManifestFacsimileViewer} from './facsimile/ManifestFacsimileViewer';
import {Page} from "./Page.tsx";
import {
  ManifestFacsimileControls
} from "./facsimile/ManifestFacsimileControls.tsx";

const defaultManifest = 'https://globalise-huygens.github.io/' +
  'document-view-sandbox/iiif/manifest.json';

const collectionUrl = 'https://data.globalise.huygens.knaw.nl/' +
  'hdl:20.500.14722/inventory:collection';

const MANIFEST = 'manifest';
const CANVAS = 'canvas';

export function ManifestPageFacsimileExample() {
  const params = new URLSearchParams(location.search);

  const [manifestUrl, setManifestUrl] = useState(
    params.get(MANIFEST) ?? defaultManifest
  );
  const initialCanvas = Number(params.get(CANVAS)) || 0;
  const allManifests = useCollectionManifests(collectionUrl);

  function handleManifestChange(url: string) {
    setManifestUrl(url);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set(MANIFEST, url);
    newUrl.searchParams.delete(CANVAS);
    history.pushState({}, '', newUrl);
  }

  function handleCanvasChange(index: number) {
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set(CANVAS, String(index));
    history.replaceState({}, '', newUrl);
  }

  return (
    <ViewerProvider>
      <ManifestLoader url={manifestUrl}>
        <Page
          header={
            <>
              <ManifestDropdown
                manifests={allManifests}
                selected={manifestUrl}
                onChange={handleManifestChange}
              />
              <ManifestFacsimileControls/>
            </>
          }
        >
          <ManifestFacsimileViewer
            initialCanvas={initialCanvas}
            onCanvasChange={handleCanvasChange}
          />
        </Page>
      </ManifestLoader>
    </ViewerProvider>
  );
}

