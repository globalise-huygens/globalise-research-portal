import { lazy, Suspense, useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { EntityPreviewBody, ObjectCardSection } from '@globalise/design';
import { url, type LinkedArtNode } from '@globalise/common';
import type { FeatureCollection, Point } from 'geojson';
import { getPersonPlaces, getPlaceCoordinates } from './PersonPlacesModel.ts';
import { entityResourceQueryOptions } from './RelationValueResolver.ts';
import { getResourcePreview } from './ResourcePreviewModel.ts';
import { RelationLink } from './RelationLink.tsx';

type MapPlace = { node: LinkedArtNode };
const WorldMap = lazy(() => import('@globalise/map/WorldMap').then((module) => ({ default: module.default<MapPlace> })));

export function PersonPlaces({ entity }: { entity: LinkedArtNode }) {
  const references = useMemo(() => getPersonPlaces(entity), [entity]);
  const features = useQueries({
    queries: references.map((node) => {
      const uri = url(node);
      return {
        ...entityResourceQueryOptions(uri ?? ''),
        enabled: !!uri && !getPlaceCoordinates(node),
      };
    }),
    combine: (results): FeatureCollection<Point, MapPlace> => ({
      type: 'FeatureCollection',
      features: references.flatMap((node, index) => {
        const uri = url(node);
        if (!uri) {return [];}
        const resource = results[index]?.data ?? node;
        const coordinates = getPlaceCoordinates(resource);
        return coordinates ? [{ type: 'Feature', id: uri, geometry: { type: 'Point', coordinates }, properties: { node: resource } }] : [];
      }),
    }),
  });

  if (!features.features.length) {return null;}
  return <Suspense fallback={null}>
    <ObjectCardSection title="Map" collapsible>
      <WorldMap places={features} showControls
        popoverClassName="gds entity-preview"
        renderPopoverPlace={(place, { keepOpen }) => (
          <EntityPreviewBody data={getResourcePreview(place.properties.node, String(place.id), (nodes) => nodes.map((node, index) => (
            <span key={node.id ?? index}>{index > 0 && ', '}<RelationLink node={node} /></span>
          )))} onKeepOpen={keepOpen} />
        )}
      />
    </ObjectCardSection>
  </Suspense>;
}
