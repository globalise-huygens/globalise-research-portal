import { MetadataPanel } from '@globalise/metadata';
import { ManifestDropdown, useCollectionManifests } from '@globalise/manifest';
import { Page } from './Page.tsx';
import { ManifestLoader } from '@globalise/facsimile';
import { useState } from 'react';
import { ViewerProvider } from '@knaw-huc/osd-iiif-viewer';

const defaultManifest = 'https://data.globalise.huygens.knaw.nl/' +
  'hdl:20.500.14722/inventory:1053.manifest';

const collectionUrl = 'https://data.globalise.huygens.knaw.nl/' +
  'hdl:20.500.14722/inventory:collection';

export function MetadataPage() {
  const [manifestUrl, setManifestUrl] = useState(defaultManifest);
  const allManifests = useCollectionManifests(collectionUrl);

  return <ViewerProvider>
    <ManifestLoader url={manifestUrl}>
      <Page
        header={
          <>
            <div style={{ flex: 1, minWidth: 0 }}>
              <ManifestDropdown
                manifests={allManifests}
                selected={manifestUrl}
                onChange={setManifestUrl}
              />
            </div>
          </>
        }
      >
        <MetadataPanel/>
      </Page>
    </ManifestLoader>
  </ViewerProvider>;
}