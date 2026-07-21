import {
  setSelectedCanvas,
  useDocumentStore,
} from '@globalise/common/document';
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

const defaultManifest =
  'https://data.globalise.huygens.knaw.nl/' +
  'hdl:20.500.14722/inventory:1053.manifest';

const collectionUrl =
  'https://data.globalise.huygens.knaw.nl/' +
  'hdl:20.500.14722/inventory:collection';

const MANIFEST = 'manifest';
const CANVAS = 'canvas';

export function ManifestPage() {
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const initialCanvasId = params.get(CANVAS) ?? undefined;
  const [manifestUrl, setManifestUrl] = useState(
    params.get(MANIFEST) ?? defaultManifest,
  );

  const allManifests = useCollectionManifests(collectionUrl);

  useEffect(syncCanvasParam, []);
  function syncCanvasParam() {
    useDocumentStore.subscribe((state, prev) => {
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
    useDocumentStore.subscribe((state, prev) => {
      const currentClickedId = state.clickedId;
      const prevClickedId = prev.clickedId;
      if (!currentClickedId || currentClickedId === prevClickedId) {
        return;
      }
      const cid = state.selectedCanvasId;
      const annos = cid && state.canvases[cid].annotations;
      const clickedAnno = annos && typeof annos === 'object' && annos[currentClickedId]; 
      console.log('navigateToObjectCard', { currentClickedId,cid, annos, clickedAnno });
      navigate('/object-card' /*TODO and set param here*/);
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
