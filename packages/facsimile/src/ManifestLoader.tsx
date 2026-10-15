import { useEffect } from 'react';
import {
  useLoadManifest,
  useManifest,
} from '@knaw-huc/osd-iiif-viewer';
import { startCanvasTiming } from '@globalise/common/document';
import { fetchPatchManifest } from './fetchPatchManifest.ts';


type ManifestLoaderProps = {
  children: React.ReactNode,
  url: string,
  canvasId?: string,
};

export function ManifestLoader(
  { children, url, canvasId }: ManifestLoaderProps,
) {
  const loadManifest = useLoadManifest();

  const manifest = useManifest();

  useEffect(() => {
    const endFetch = startCanvasTiming('manifest fetch', { url });
    void fetchPatchManifest(url)
      .then((patched) => {
        endFetch();
        const endLoad = startCanvasTiming('manifest load', { url });
        void loadManifest(url, { manifest: patched, canvasId }).then(() => endLoad());
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadManifest, url]);

  if (manifest.isLoading) {
    return <>Loading manifest...</>;
  }
  if (manifest.error) {
    return <>Error: {manifest.error}</>;
  }
  if (!manifest.isReady) {
    return null;
  }

  return <>{children}</>;
}