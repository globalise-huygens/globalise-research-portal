import { CSSProperties, useRef } from 'react';
import WorldMap, { type WorldMapHandler } from './WorldMap';

import type { FeatureCollection, Point, LineString, Feature } from 'geojson';

import places from './places.json' with { type: 'json' };
import voyages from './voyages.json' with { type: 'json' };

const popoverStyle: CSSProperties = {
  padding: '0.5rem',
  maxWidth: '20rem',
  lineBreak: 'anywhere',
  fontSize: '0.9rem',
  color: 'black',
  background: 'white',
  border: '1px solid black',
};

const placesGeoJSON: FeatureCollection<Point> = {
  type: 'FeatureCollection',
  features: places.filter((place) => place.geometry).map((place) => {
    const { geometry, ...properties } = place;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const match = /^POINT\s*\(\s*(-?\d+(\.\d+)?)\s+(-?\d+(\.\d+)?)\s*\)$/i.exec((geometry!));
    if (!match) {
      throw new Error(`Invalid WKT: ${geometry}`);
    }

    const lon = parseFloat(match[1]);
    const lat = parseFloat(match[3]);

    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [lon, lat],
      },
      properties,
    };
  }),
};

function renderPlacePopover(place: Feature<Point>) {
  return (
    <div style={popoverStyle}>
      Place: {JSON.stringify(place.properties)}
    </div>
  );
}

function renderVoyagePopover(voyage: Feature<LineString>) {
  return (
    <div style={popoverStyle}>
      Voyage: {JSON.stringify(voyage.properties)}
    </div>
  );
}

export default function MapDemo() {
  const ref = useRef<WorldMapHandler>(null);

  const onClickPlace = (place: Feature<Point>) => console.log('onClickPlace', place);
  const onClickVoyage = (voyage: Feature<LineString>) => console.log('onClickVoyage', voyage);

  return (
    <WorldMap style={{ width: '40%', margin: '2rem auto' }}
      places={placesGeoJSON} voyages={voyages as FeatureCollection<LineString>}
      onClickPlace={onClickPlace} onClickVoyage={onClickVoyage}
      renderPopoverPlace={renderPlacePopover} renderPopoverVoyage={renderVoyagePopover}
      ref={ref}/>
  );
}
