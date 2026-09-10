import { ReactNode, useEffect, useRef, useState, useImperativeHandle, MouseEvent, Ref, type CSSProperties } from 'react';
import { Popover } from 'react-aria-components';
import { cn } from '@globalise/design';
import drawMap, { type MapInteraction } from './drawMap';
import classes from './WorldMap.module.css';

import type { GeoJsonProperties, Feature, FeatureCollection, Point, LineString } from 'geojson';

export type WorldMapProps<P extends GeoJsonProperties = GeoJsonProperties> = {
  className?: string;
  style?: CSSProperties;
  places?: FeatureCollection<Point, P>;
  voyages?: FeatureCollection<LineString, P>;
  renderPopoverPlace?: (place: Feature<Point, P>) => ReactNode;
  renderPopoverVoyage?: (voyage: Feature<LineString, P>) => ReactNode;
  onClickPlace?: (place: Feature<Point, P>) => void;
  onClickVoyage?: (voyage: Feature<LineString, P>) => void;
  ref: Ref<WorldMapHandler>;
};

export type WorldMapHandler = {
  rotateTo: (coordinates: [number, number]) => void;
};

export default function WorldMap<P extends GeoJsonProperties = GeoJsonProperties>({
  className,
  style,
  places,
  voyages,
  renderPopoverPlace,
  renderPopoverVoyage,
  onClickPlace,
  onClickVoyage,
  ref,
}: WorldMapProps<P>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const popoverAnchorRef = useRef<HTMLSpanElement>(null);
  const mapInteractionRef = useRef<MapInteraction<P>>(null);

  const [coordinates, setCoordinates] = useState([0, 0]);
  const [hoveredPlace, setHoveredPlace] = useState<Feature<Point, P> | null>(null);
  const [hoveredVoyage, setHoveredVoyage] = useState<Feature<LineString, P> | null>(null);

  const showPlacePopover = !!(renderPopoverPlace && hoveredPlace);
  const showVoyagePopover = !!(renderPopoverVoyage && hoveredVoyage);

  function handleHover(e: MouseEvent<HTMLCanvasElement>) {
    if (mapInteractionRef.current && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setCoordinates([e.nativeEvent.clientX - rect.left, e.nativeEvent.clientY - rect.top]);

      setHoveredPlace(mapInteractionRef.current.overPlace(e.nativeEvent));
      setHoveredVoyage(mapInteractionRef.current.overVoyage(e.nativeEvent));
    }
  }

  function handleLeave() {
    setCoordinates([0, 0]);
    setHoveredPlace(null);
    setHoveredVoyage(null);
  }

  function handleClick(e: MouseEvent<HTMLCanvasElement>) {
    if (mapInteractionRef.current) {
      if (onClickPlace) {
        const place = mapInteractionRef.current.overPlace(e.nativeEvent);
        if (place) {
          onClickPlace(place);
          return;
        }
      }

      if (onClickVoyage) {
        const voyage = mapInteractionRef.current.overVoyage(e.nativeEvent);
        if (voyage) {
          onClickVoyage(voyage);
          return;
        }
      }
    }
  }

  useEffect(() => {
    if (canvasRef.current) {
      mapInteractionRef.current = drawMap(canvasRef.current, places, voyages);
    }
  }, [places, voyages]);

  useImperativeHandle(ref, () => ({
    rotateTo: (coordinates: [number, number]) => {
      if (mapInteractionRef.current) {
        mapInteractionRef.current.rotateTo(coordinates);
      }
    },
  }), []);

  return (
    <div className={cn(classes.worldMap, className)} style={style}>
      <canvas ref={canvasRef} aria-label="World map"
        onMouseMove={handleHover} onMouseLeave={handleLeave} onClick={handleClick}/>

      <span ref={popoverAnchorRef} className={classes.anchor} aria-hidden="true"
        style={{ left: coordinates[0], top: coordinates[1] }}/>

      {(renderPopoverPlace ?? renderPopoverVoyage) && (
        <Popover triggerRef={popoverAnchorRef} isOpen={showPlacePopover || showVoyagePopover}
          isNonModal placement="top" offset={10} shouldFlip>
          {showPlacePopover
            ? renderPopoverPlace(hoveredPlace)
            : showVoyagePopover ? renderPopoverVoyage(hoveredVoyage) : null}
        </Popover>
      )}
    </div>
  );
}
