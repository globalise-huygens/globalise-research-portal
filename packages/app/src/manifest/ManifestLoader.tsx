import {useLoadManifest, useManifest} from "@knaw-huc/osd-iiif-viewer";
import {useEffect} from "react";

export function ManifestLoader(props: {
  url: string;
  children: React.ReactNode;
}) {
  const loadManifest = useLoadManifest();
  const {isReady, isLoading, error} = useManifest();

  useEffect(() => {
    loadManifest(props.url);
  }, [props.url, loadManifest]);

  if (error) {
    return <div>Error: {error}</div>;
  }
  if (isLoading || !isReady) {
    return <div>Loading manifest...</div>;
  }
  return <>{props.children}</>;
}