import { useEffect, useMemo, useState } from 'react';
import { MetadataEntry } from './MetadataModel.ts';
import { fetchJson } from '@globalise/common';
import { toMetadata } from './toMetadata.ts';
import { MetadataListItem } from './MetadataListItem.tsx';
import { useManifest } from '@knaw-huc/osd-iiif-viewer';

export function MetadataPanel() {
  const { vault, id: manifestId, isReady: isManifestReady } = useManifest();

  const [metadata, setMetadata] = useState<MetadataEntry[]>([]);

  const curatedHoldingUrl = useMemo(() => {
    if (!isManifestReady) {
      return;
    }
    const manifest = vault.get({ id: manifestId, type: 'Manifest' });
    return manifest.seeAlso[0]?.id;
  }, [isManifestReady, manifestId]);

  useEffect(() => {
    initMetadata().catch(console.error);

    async function initMetadata() {
      if (!curatedHoldingUrl) {
        return;
      }
      const json = await fetchJson(curatedHoldingUrl);
      setMetadata(toMetadata(json));
    }
  }, [curatedHoldingUrl]);

  if (!curatedHoldingUrl) {
    return <>No CuratedHolding found</>;
  }

  return <div style={{ height: '100%', overflowY: 'scroll' }}>
    <p><a href={curatedHoldingUrl} target="_blank">{curatedHoldingUrl}</a></p>
    <ul className="metadata">
      {metadata.map((entry, index) => (
        <MetadataListItem key={index} entry={entry}/>
      ))}
    </ul>
  </div>;
}