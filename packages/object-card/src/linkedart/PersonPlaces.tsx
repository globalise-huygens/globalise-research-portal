import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { EntityPreviewBody, ObjectCardSection } from '@globalise/design';
import { url, type LinkedArtNode } from '@globalise/common';
import type { FeatureCollection, Point } from 'geojson';
import { getPersonPlaces, getPlaceCoordinates } from './PersonPlacesModel.ts';
import { resolveRelationResource } from './RelationValueResolver.ts';
import { getResourcePreview } from './ResourcePreviewModel.ts';
import { RelationLink } from './RelationLink.tsx';

type MapPlace = { node: LinkedArtNode };
const WorldMap = lazy(() => import('@globalise/map/WorldMap').then((module) => ({ default: module.default<MapPlace> })));

export function PersonPlaces({ entity }: { entity: LinkedArtNode }) {
  const references = useMemo(() => getPersonPlaces(entity), [entity]);
  const [resolved, setResolved] = useState<{ entity: LinkedArtNode; places: Map<string, LinkedArtNode> }>();

  useEffect(() => {
    if (!references.length) {return;}
    let active = true;
    void Promise.all(references.map(async (node) => {
      const uri = url(node);
      return uri ? [uri, getPlaceCoordinates(node) ? node : await resolveRelationResource(uri)] as const : undefined;
    })).then((results) => {
      if (active) {setResolved({ entity, places: new Map(results.flatMap((result) => result?.[1] ? [[result[0], result[1]]] : [])) });}
    });
    return () => { active = false; };
  }, [entity, references]);

  const places = resolved?.entity === entity ? resolved.places : undefined;
  const features = useMemo((): FeatureCollection<Point, MapPlace> => ({
    type: 'FeatureCollection',
    features: references.flatMap((node) => {
      const uri = url(node);
      if (!uri) {return [];}
      const resource = places?.get(uri) ?? node;
      const coordinates = getPlaceCoordinates(resource);
      return coordinates ? [{ type: 'Feature', id: uri, geometry: { type: 'Point', coordinates }, properties: { node: resource } }] : [];
    }),
  }), [references, places]);

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
