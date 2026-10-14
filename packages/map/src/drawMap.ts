import { zoom, type D3ZoomEvent } from 'd3-zoom';
import 'd3-transition';
import { interpolate } from 'd3-interpolate';
import { pointer, select } from 'd3-selection';
import { geoPath, geoOrthographic, geoDistance, geoCentroid, GeoSphere } from 'd3-geo';
import { feature } from 'topojson-client';
import handleDrag from './handleDrag';
import { svgEntityPlaceFilled } from '@globalise/design';

import type { GeoJsonProperties, Feature, FeatureCollection, Point, LineString } from 'geojson';

import land50m from './land-50m.json' with { type: 'json' };
import land110m from './land-110m.json' with { type: 'json' };

export type MapInteraction<P extends GeoJsonProperties = GeoJsonProperties> = {
  rotateTo: ([lon, lat]: [number, number]) => void;
  overPlace: (e: MouseEvent) => Feature<Point, P> | null;
  overVoyage: (e: MouseEvent) => Feature<LineString, P> | null;
  resize: () => void;
  reset: (coordinates?: [number, number]) => void;
  rotateBy: (longitude: number, latitude: number) => void;
  zoomBy: (factor: number) => void;
  zoomTo: (factor: number) => void;
  destroy: () => void;
};

// @ts-expect-error Typing is correct
const ftLand110m = feature(land110m, land110m.objects.land);
// @ts-expect-error Typing is correct
const ftLand50m = feature(land50m, land50m.objects.land);

export default function drawMap<P extends GeoJsonProperties = GeoJsonProperties>(
  canvas: HTMLCanvasElement,
  places?: FeatureCollection<Point, P>,
  voyages?: FeatureCollection<LineString, P>,
  onZoomChange?: (percent: number) => void,
): MapInteraction<P> {
  const renderLowScale = () => render(false);
  const renderAutoScale = () => render(true);

  function render(useAutoScale: boolean) {
    const land = useAutoScale ? determineLandScale() : ftLand110m;

    context.reset();
    context.scale(pixelRatio, pixelRatio);

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
      context.fillStyle = getComputedStyle(canvas).color;
      for (const place of places.features) {
        const point = projectPlace(place);
        if (!point) {continue;}
        context.save();
        // Anchor the existing icon's tip (480, -80) at the place coordinate.
        context.translate(point[0] - 480 * pinScale, point[1] + 80 * pinScale);
        context.scale(pinScale, pinScale);
        context.fill(pin, 'evenodd');
        context.restore();
      }
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
    select(canvas).interrupt().transition()
      .duration(window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1000 * (projection.scale() / scale))
      .tween('rotate', () => {
        const r = interpolate(projection.rotate(), [-lon, -lat]);
        return (t) => {
          projection.rotate(r(t) as [number, number] | [number, number, number]);
          renderLowScale();
        };
      })
      .on('end', renderAutoScale);
  }

  function projectPlace(place: Feature<Point, P>) {
    const rotation = projection.rotate();
    const point = place.geometry.coordinates as [number, number];
    if (geoDistance(point, [-rotation[0], -rotation[1]]) > Math.PI / 2) {return null;}
    return projection(point);
  }

  function overPlace(e: MouseEvent) {
    const [mx, my] = pointer(e, canvas);

    if (places) {
      for (const place of places.features) {
        const coordinates = projectPlace(place);
        if (!coordinates) {
          continue;
        }

        const dx = mx - coordinates[0];
        const dy = my - coordinates[1] + 12;
        if (Math.abs(dx) <= 22 && Math.abs(dy) <= 22) {
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

  const context = canvas.getContext('2d')!;
  const pin = new Path2D(new DOMParser().parseFromString(svgEntityPlaceFilled, 'image/svg+xml').querySelector('path')?.getAttribute('d') ?? '');
  const pinScale = 28 / 960;

  const width = canvas.offsetWidth || 320;
  let pixelRatio = window.devicePixelRatio || 1;
  canvas.width = width * pixelRatio;
  const height = canvas.offsetHeight || width;
  canvas.height = height * pixelRatio;

  const sphere = { type: 'Sphere' } satisfies GeoSphere;
  const projection = geoOrthographic()
    .fitExtent([[1, 1], [width - 1, height - 1]], sphere)
    .rotate([-110, 0]);
  let scale = projection.scale();
  const path = geoPath(projection, context).pointRadius(5);
  const zoomBehavior = zoom<HTMLCanvasElement, unknown>()
    .scaleExtent([1, 8])
    .on('zoom', (e: D3ZoomEvent<HTMLCanvasElement, unknown>) => {
      projection.scale(scale * e.transform.k);
      onZoomChange?.(Math.round(e.transform.k * 100));
    })
    .on('zoom.render', renderLowScale)
    .on('end.render', renderAutoScale);

  select(canvas)
    .call(handleDrag(projection)
      .on('start.interrupt', () => select(canvas).interrupt())
      .on('drag.render', renderLowScale)
      .on('end.render', renderAutoScale))
    .call(zoomBehavior)
    .call(renderAutoScale)
    .node();

  function resize() {
    const width = canvas.offsetWidth;
    if (!width) {return;}
    const zoomFactor = projection.scale() / scale;
    pixelRatio = window.devicePixelRatio || 1;
    const height = canvas.offsetHeight || width;
    canvas.width = width * pixelRatio;
    canvas.height = height * pixelRatio;
    projection.fitExtent([[1, 1], [width - 1, height - 1]], sphere);
    scale = projection.scale();
    projection.scale(scale * zoomFactor);
    renderAutoScale();
  }

  return {
    rotateTo, overPlace, overVoyage, resize,
    reset: (coordinates) => {
      select(canvas).interrupt();
      const center = coordinates ?? (places?.features.length ? geoCentroid(places) : [110, 0]);
      const [lon, lat] = center.every(Number.isFinite) ? center : places?.features[0]?.geometry.coordinates ?? [110, 0];
      projection.rotate([-lon, -lat, 0]);
      zoomBehavior.scaleTo(select(canvas), 1);
      renderAutoScale();
    },
    rotateBy: (longitude, latitude) => {
      select(canvas).interrupt();
      const rotation = projection.rotate();
      projection.rotate([rotation[0] + longitude, Math.max(-90, Math.min(90, rotation[1] + latitude)), rotation[2]]);
      renderAutoScale();
    },
    zoomBy: (factor) => zoomBehavior.scaleBy(select(canvas), factor),
    zoomTo: (factor) => zoomBehavior.scaleTo(select(canvas), Math.max(1, Math.min(8, factor))),
    destroy: () => { select(canvas).interrupt().on('.drag', null).on('.zoom', null); },
  };
}
