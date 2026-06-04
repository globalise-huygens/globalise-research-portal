import {useEffect} from 'react';
import {
  useLoadManifest,
  useManifest
} from "@knaw-huc/osd-iiif-viewer";


type ManifestLoaderProps = {
  children: React.ReactNode,
  url: string,
  canvasId?: string,
};

export function ManifestLoader(
  {children, url, canvasId}: ManifestLoaderProps
) {
  const loadManifest = useLoadManifest();

  const manifest = useManifest();

  useEffect(() => {
    loadManifest(url, canvasId);
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