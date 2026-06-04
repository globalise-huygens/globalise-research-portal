import {ViewerProvider} from '@knaw-huc/osd-iiif-viewer';
import {Id} from '@globalise/common/annotation';
import {ManifestLoader} from '@globalise/facsimile';
import {useManifest} from "@knaw-huc/osd-iiif-viewer";
import {useDocumentStore} from "@globalise/common/document";
import {useEffect, useState} from "react";
import {DocumentView, HeaderProvider, HeaderRegion} from "@globalise/document";
import {
  ManifestDropdown,
  useCollectionManifests
} from "@globalise/manifest";

const defaultManifest = 'https://globalise-huygens.github.io/' +
  'document-view-sandbox/iiif/manifest.json';
const collectionUrl = 'https://data.globalise.huygens.knaw.nl/' +
  'hdl:20.500.14722/inventory:collection';

const MANIFEST = 'manifest';
const CANVAS = 'canvas';

export function DocumentPage() {
  const initialParams = new URLSearchParams(location.search);

  const [manifestUrl, setManifestUrl] = useState(
    initialParams.get(MANIFEST) ?? defaultManifest
  );
  const [canvasId, setCanvasId] = useState(
    initialParams.get(CANVAS) ?? undefined
  );

  function handlePageChange(pageId: Id) {
    setCanvasId(pageId);
    const url = new URL(window.location.href);
    url.searchParams.set(CANVAS, pageId);
    history.pushState({}, '', url);
  }

  function handleManifestChange(url: string) {
    setManifestUrl(url);
    setCanvasId(undefined);
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set(MANIFEST, url);
    newUrl.searchParams.delete(CANVAS);
    history.pushState({}, '', newUrl);
  }

  return (
    <HeaderProvider>
      <ViewerProvider>
        <ManifestLoader url={manifestUrl} canvasId={canvasId}>
          <DocumentManifestDropdown
            manifestUrl={manifestUrl}
            onChange={handleManifestChange}
          />
          <StateDebug/>
          <DocumentView
            manifestUrl={manifestUrl}
            canvasId={canvasId || undefined}
            onPageChange={handlePageChange}
          />
        </ManifestLoader>
      </ViewerProvider>
    </HeaderProvider>
  );
}

interface DocumentManifestDropdownProps {
  manifestUrl: string,
  onChange: (url: string) => void
}

function DocumentManifestDropdown(
  {manifestUrl, onChange}: DocumentManifestDropdownProps
) {

  const allManifests = useCollectionManifests(collectionUrl);

  return <HeaderRegion region="center">
    <ManifestDropdown
      manifests={allManifests}
      selected={manifestUrl}
      onChange={onChange}
    />
  </HeaderRegion>
}

export function StateDebug() {
  const manifest = useManifest();
  const document = useDocumentStore();
  useEffect(() => {
    console.debug('Manifest state:', manifest);
  }, [manifest]);

  useEffect(() => {
    console.debug('Document state:', document);
  }, [document]);

  return null;
}