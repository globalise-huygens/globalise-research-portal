import {useState} from 'react';
import {ViewerProvider,} from '@knaw-huc/osd-iiif-viewer';
import {HeaderProvider, HeaderRegion} from '@globalise/common/header';
import {ManifestDropdown} from "./dropdown/ManifestDropdown.tsx";
import {useCollectionManifests} from "./dropdown/useCollectionManifests.tsx";
import {ManifestLoader} from "./ManifestLoader.tsx";
import {HeaderBar} from "@globalise/document";
import {ManifestFacsimileViewer} from "./facsimile/ManifestFacsimileViewer.tsx";

import './ManifestPage.css';

const defaultManifest = 'https://globalise-huygens.github.io/' +
  'document-view-sandbox/iiif/manifest.json';

const collectionUrl = 'https://data.globalise.huygens.knaw.nl/' +
  'hdl:20.500.14722/inventory:collection';

const MANIFEST = 'manifest';
const CANVAS = 'canvas';

export function ManifestTranscriptionExample() {
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
    <HeaderProvider>
      <ViewerProvider>
        <ManifestLoader url={manifestUrl}>
          <HeaderBar/>

          <HeaderRegion region="center">
            <ManifestDropdown
              manifests={allManifests}
              selected={manifestUrl}
              onChange={handleManifestChange}
            />
          </HeaderRegion>

          <div className="manifest-page">
            Manifest transcription viewer
          </div>

        </ManifestLoader>
      </ViewerProvider>
    </HeaderProvider>
  );
}

