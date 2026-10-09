import { zoom } from 'd3-zoom';
import { transition } from 'd3-transition';
import { interpolate } from 'd3-interpolate';
import { pointer, select } from 'd3-selection';
import { geoPath, geoOrthographic, GeoSphere } from 'd3-geo';
import { feature } from 'topojson-client';
import handleDrag from './handleDrag';

import type { GeoJsonProperties, Feature, FeatureCollection, Point, LineString } from 'geojson';

import land50m from './land-50m.json' with { type: 'json' };
import land110m from './land-110m.json' with { type: 'json' };

export type MapInteraction<P extends GeoJsonProperties = GeoJsonProperties> = {
  rotateTo: ([lon, lat]: [number, number]) => void;
  overPlace: (e: MouseEvent) => Feature<Point, P> | null;
  overVoyage: (e: MouseEvent) => Feature<LineString, P> | null;
};

// @ts-expect-error Typing is correct
const ftLand110m = feature(land110m, land110m.objects.land);
// @ts-expect-error Typing is correct
const ftLand50m = feature(land50m, land50m.objects.land);

export default function drawMap<P extends GeoJsonProperties = GeoJsonProperties>(
  canvas: HTMLCanvasElement,
  places?: FeatureCollection<Point, P>,
  voyages?: FeatureCollection<LineString, P>,
): MapInteraction<P> {
  const renderLowScale = () => render(false);
  const renderAutoScale = () => render(true);

  function render(useAutoScale: boolean) {
    const land = useAutoScale ? determineLandScale() : ftLand110m;

    context.reset();

    context.beginPath();
    path(sphere);
    context.fillStyle = '#fff';
    context.fill();

    context.beginPath();
    path(land);
    context.fillStyle = '#000';
    context.fill();

    context.beginPath();
    path(sphere);
    context.strokeStyle = 'white';
    context.stroke();

    if (places) {
      context.beginPath();
      path(places);
      context.fillStyle = 'grey';
      context.fill();
    }

    if (voyages) {
      context.beginPath();
      path(voyages);
      context.lineWidth = 3;
      context.strokeStyle = 'grey';
      context.setLineDash([5, 3]);
      context.stroke();
    }
  }

  function determineLandScale() {
    const scaleFactor = projection.scale() / scale;
    return scaleFactor < 2 ? ftLand110m : ftLand50m;
  }

  function rotateTo([lon, lat]: [number, number]) {
    transition()
      .duration(1000 * (projection.scale() / scale))
      .tween('rotate', () => {
        const r = interpolate(projection.rotate(), [-lon, -lat]);
        return (t) => {
          projection.rotate(r(t) as [number, number] | [number, number, number]);
          renderLowScale();
        };
      });
  }

  function overPlace(e: MouseEvent) {
    const [mx, my] = pointer(e, canvas);

    if (places) {
      for (const place of places.features) {
        const coordinates = projection(place.geometry.coordinates as [number, number]);
        if (!coordinates) {
          continue;
        }

        const dx = mx - coordinates[0];
        const dy = my - coordinates[1];
        if (dx * dx + dy * dy < 25) {
          return place;
        }
      }
    }

    return null;
  }

  function overVoyage(e: MouseEvent) {
    const [mx, my] = pointer(e, canvas);

    if (voyages) {
      for (const voyage of voyages.features) {
        for (let i = 0; i < voyage.geometry.coordinates.length - 1; i++) {
          const a = projection(voyage.geometry.coordinates[i] as [number, number]);
          const b = projection(voyage.geometry.coordinates[i + 1] as [number, number]);
          if (!a || !b) {
            continue;
          }

          const dx = b[0] - a[0];
          const dy = b[1] - a[1];

          const t = Math.max(0,
            Math.min(1,
              ((mx - a[0]) * dx + (my - a[1]) * dy) / (dx * dx + dy * dy)));

          const closestX = a[0] + t * dx;
          const closestY = a[1] + t * dy;

          if (Math.hypot(mx - closestX, my - closestY) <= 25) {
            return voyage;
          }
        }
      }
    }

    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const context = canvas.getContext('2d')!;

  const width = canvas.offsetWidth;
  const height = width;
  canvas.width = width;
  canvas.height = height;

  const sphere = { type: 'Sphere' } satisfies GeoSphere;
  const projection = geoOrthographic()
    .fitExtent([[1, 1], [width - 1, height - 1]], sphere)
    .rotate([-110, 0]);
  const scale = projection.scale();
  const path = geoPath(projection, context).pointRadius(5);

  select(canvas)
    .call(handleDrag(projection)
      .on('drag.render', renderLowScale)
      .on('end.render', renderAutoScale))
    .call(zoom<HTMLCanvasElement, unknown>()
      .scaleExtent([1, 8])
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      .on('zoom', (e) => projection.scale(scale * e.transform.k))
      .on('zoom.render', renderLowScale)
      .on('end.render', renderAutoScale))
    .call(renderAutoScale)
    .node();

  return { rotateTo, overPlace, overVoyage };
}
