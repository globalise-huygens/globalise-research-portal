import { useEffect, useMemo } from 'react';
import { loadMetadata, useMetadata } from '@globalise/common';
import { useManifest } from '@knaw-huc/osd-iiif-viewer';
import {
  HandleField, MemberOfField, PlacesField, TimespanField, TitlesField,
} from './fields';
import '@globalise/design/inline-icon.css';

/**
 * Metadata panel renders linked art metadata of a manifest.
 * The `fields/` components extract metadata from linked art json
 * and render that data using generic metadata components from `./common`.
 */
export function MetadataPanel() {
  const { vault, id: manifestId, isReady: isManifestReady } = useManifest();

  const curatedHoldingUrl = useMemo(() => {
    if (!isManifestReady) {
      return;
    }
    const manifest = vault.get({ id: manifestId, type: 'Manifest' });
    return manifest.seeAlso[0]?.id;
  }, [isManifestReady, manifestId]);

  const { isReady, error } = useMetadata(curatedHoldingUrl);

  useEffect(() => {
    if (curatedHoldingUrl) {
      loadMetadata(curatedHoldingUrl)
        .catch(console.error);
    }
  }, [curatedHoldingUrl]);

  if (!curatedHoldingUrl) {
    return <>No CuratedHolding found</>;
  }
  if (error) {
    return <>Could not load metadata: {error}</>;
  }
  if (!isReady) {
    return null;
  }

  return (
    <div className="manifest-viewer-metadata">
      <dl>
        <TitlesField url={curatedHoldingUrl} />
        <PlacesField url={curatedHoldingUrl} />
        <TimespanField url={curatedHoldingUrl} />
        <HandleField url={curatedHoldingUrl} />
      </dl>
      <MemberOfField url={curatedHoldingUrl}/>
    </div>
  );
}