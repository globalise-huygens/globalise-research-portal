import { useLoadManifest, useManifest } from '@knaw-huc/osd-iiif-viewer';
import { ReactNode, useEffect } from 'react';

export function ManifestLoader(props: {
  url: string;
  children: ReactNode;
}) {
  const loadManifest = useLoadManifest();
  const { isReady, isLoading, error } = useManifest();

  useEffect(() => {
    void loadManifest(props.url);
  }, [props.url, loadManifest]);

  if (error) {
    return <div>Error: {error}</div>;
  }
  if (isLoading || !isReady) {
    return <div>Loading manifest...</div>;
  }
  return <>{props.children}</>;
}