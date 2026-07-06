import {useEffect, useMemo, useState} from 'react';
import {fetchJson} from '@globalise/common';
import {toMetadata} from './toMetadata.ts';
import {useManifest} from '@knaw-huc/osd-iiif-viewer';
import {toCategoryViews} from './toCategoryViews.ts';
import {metadataConfig} from './metadata.config.ts';
import {MetadataSection} from './MetadataSection.tsx';

export function MetadataPanel() {
  const {vault, id: manifestId, isReady: isManifestReady} = useManifest();

  const [json, setLinkedArt] = useState<unknown>();

  const curatedHoldingUrl = useMemo(() => {
    if (!isManifestReady) {
      return;
    }
    const manifest = vault.get({id: manifestId, type: 'Manifest'});
    return manifest.seeAlso[0]?.id;
  }, [isManifestReady, manifestId]);

  const view = useMemo(() => {
    const entries = toMetadata(json);
    return toCategoryViews(entries, metadataConfig);
  }, [json]);

  useEffect(() => {
    if (!curatedHoldingUrl) {
      return;
    }
    fetchJson(curatedHoldingUrl)
      .then(setLinkedArt)
      .catch(console.error)
    ;
  }, [curatedHoldingUrl]);

  if (!curatedHoldingUrl) {
    return <>No CuratedHolding found</>;
  }

  return <div style={{height: '100%', overflowY: 'scroll', width: '40rem'}}>
    <p><a href={curatedHoldingUrl} target="_blank">{curatedHoldingUrl}</a></p>
    <MetadataSection categorViews={view}/>;
  </div>;
}