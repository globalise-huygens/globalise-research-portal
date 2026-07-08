import { useEffect, useMemo, useState } from 'react';
import { fetchJson } from '@globalise/common';
import { toMetadata } from './toMetadata.ts';
import { useManifest } from '@knaw-huc/osd-iiif-viewer';
import { toCategoryViews } from './toCategoryViews.ts';
import { metadataConfig } from './metadataConfig.ts';
import { MetadataView } from './MetadataView.tsx';
import './MetadataPanel.css';

export function MetadataPanel() {
  const { vault, id: manifestId, isReady: isManifestReady } = useManifest();

  const [json, setLinkedArt] = useState<unknown>();

  const curatedHoldingUrl = useMemo(() => {
    if (!isManifestReady) {
      return;
    }
    const manifest = vault.get({ id: manifestId, type: 'Manifest' });
    return manifest.seeAlso[0]?.id;
  }, [isManifestReady, manifestId]);

  const propsToSkip = new Set(metadataConfig.propsToSkip);
  const categories = useMemo(
    () => toCategoryViews(toMetadata(json, propsToSkip), metadataConfig),
    [json],
  );

  useEffect(() => {
    if (!curatedHoldingUrl) {
      return;
    }
    fetchJson(curatedHoldingUrl)
      .then(setLinkedArt)
      .catch(console.error);
  }, [curatedHoldingUrl]);

  if (!curatedHoldingUrl) {
    return <>No CuratedHolding found</>;
  }

  return <div style={{ height: '100%', overflowY: 'scroll', width: '40rem' }}>
    <p><a href={curatedHoldingUrl} target="_blank">{curatedHoldingUrl}</a></p>
    <MetadataView categories={categories}/>;
  </div>;
}