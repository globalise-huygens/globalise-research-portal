import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  useLoadManifest,
  useManifest,
} from '@knaw-huc/osd-iiif-viewer';
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

  const { data: patched } = useQuery({
    queryKey: ['manifest', url],
    queryFn: ({ signal }) => fetchPatchManifest(url, signal),
    staleTime: Infinity,
  });

  useEffect(() => {
    if (patched && manifest.url !== url) {
      void loadManifest(url, { manifest: patched, canvasId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadManifest, patched, url]);

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