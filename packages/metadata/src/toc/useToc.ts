import { useMemo } from 'react';
import { useManifest } from '@knaw-huc/osd-iiif-viewer';
import { toToc, type ManifestDocument } from './toToc';

const emptyToc: ManifestDocument[] = [];

export function useToc(): ManifestDocument[] {
  const { vault, id, isReady } = useManifest();
  return useMemo(
    () => isReady && id ? toToc(vault, id) : emptyToc,
    [vault, id, isReady],
  );
}