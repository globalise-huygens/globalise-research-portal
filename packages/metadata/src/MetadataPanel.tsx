import { useEffect, useMemo } from 'react';
import { loadMetadata, useMetadata } from '@globalise/common';
import { useManifest } from '@knaw-huc/osd-iiif-viewer';
import {
  MemberOfField, PlacesField, TimespanField, TitlesField,
} from './fields';
import '@globalise/design/inline-icon.css';
import { HandleField } from './fields/HandleField.tsx';

/**
 * Metadata panel renders linked art metadata of a manifest.
 * The `fields/` components extract metadata from linked art json
 * and render that data using generic metadata components from `./common`.
 */
export function MetadataPanel() {
  const { vault, id: manifestId, isReady: isManifestReady } = useManifest();
  const { isReady, error } = useMetadata();

  const curatedHoldingUrl = useMemo(() => {
    if (!isManifestReady) {
      return;
    }
    const manifest = vault.get({ id: manifestId, type: 'Manifest' });
    return manifest.seeAlso[0]?.id;
  }, [isManifestReady, manifestId]);

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
    <div className="document-detail-overlay-metadata">
      <dl>
        <TitlesField />
        <PlacesField />
        <TimespanField />
        <HandleField />
      </dl>
      <MemberOfField/>
    </div>
  );
}
