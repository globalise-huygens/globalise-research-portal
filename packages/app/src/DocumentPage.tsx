import {ViewerProvider} from '@knaw-huc/osd-iiif-viewer';
import {Id} from '@globalise/common/annotation';
import {ManifestLoader} from '@globalise/facsimile';
import {HeaderProvider} from '@globalise/common/header';
import {DocumentView} from "@globalise/document";

const defaultManifest = 'https://globalise-huygens.github.io/' +
  'document-view-sandbox/iiif/manifest.json';

const MANIFEST = 'manifest';
const CANVAS = 'canvas';

export function DocumentPage() {
  const params = new URLSearchParams(location.search);
  const canvasId = params.get(CANVAS) ?? undefined;
  const manifestUrl = params.get(MANIFEST) ?? defaultManifest;

  function handlePageChange(pageId: Id) {
    const url = new URL(window.location.href);
    url.searchParams.set(CANVAS, pageId);
    history.pushState({}, '', url);
  }

  return (
    <HeaderProvider>
      <ViewerProvider>
        <ManifestLoader url={manifestUrl}>
          <StateDebug />
          <DocumentView
            manifestUrl={manifestUrl}
            canvasId={canvasId}
            onPageChange={handlePageChange}
          />
        </ManifestLoader>
      </ViewerProvider>
    </HeaderProvider>
  );
}

import {useManifest} from "@knaw-huc/osd-iiif-viewer";
import {useDocumentStore} from "@globalise/common/document";
import {useEffect} from "react";

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