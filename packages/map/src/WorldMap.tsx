import { ReactNode, useEffect, useRef, useState, useImperativeHandle, MouseEvent, Ref, type CSSProperties } from 'react';
import { PopoverCard, FloatingToolbar, ToolButton, Tooltip, IconZoomIn, IconZoomOut, IconReset, cn } from '@globalise/design';
import drawMap, { type MapInteraction } from './drawMap';
import classes from './WorldMap.module.css';

import type { GeoJsonProperties, Feature, FeatureCollection, Point, LineString } from 'geojson';

export type WorldMapProps<P extends GeoJsonProperties = GeoJsonProperties> = {
  className?: string;
  showControls?: boolean;
  style?: CSSProperties;
  places?: FeatureCollection<Point, P>;
  voyages?: FeatureCollection<LineString, P>;
  renderPopoverPlace?: (place: Feature<Point, P>) => ReactNode;
  getPlaceLabel?: (place: Feature<Point, P>) => string;
  renderPopoverVoyage?: (voyage: Feature<LineString, P>) => ReactNode;
  onClickPlace?: (place: Feature<Point, P>) => void;
  onClickVoyage?: (voyage: Feature<LineString, P>) => void;
  ref?: Ref<WorldMapHandler>;
};

export type WorldMapHandler = {
  rotateTo: (coordinates: [number, number]) => void;
};

export default function WorldMap<P extends GeoJsonProperties = GeoJsonProperties>({
  className,
  style,
  showControls = false,
  places,
  voyages,
  renderPopoverPlace,
  getPlaceLabel,
  renderPopoverVoyage,
  onClickPlace,
  onClickVoyage,
  ref,
}: WorldMapProps<P>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLSpanElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [keyboardPreview, setKeyboardPreview] = useState(false);
  const previewTrigger = useRef<HTMLElement | null>(null);
  const selectedPlace = useRef(0);
  const mapInteractionRef = useRef<MapInteraction<P>>(null);

  const [coordinates, setCoordinates] = useState([0, 0]);
  const [zoomPercent, setZoomPercent] = useState(100);
  const [zoomInput, setZoomInput] = useState<string | null>(null);
  const [hoveredPlace, setHoveredPlace] = useState<Feature<Point, P> | null>(null);
  const [hoveredVoyage, setHoveredVoyage] = useState<Feature<LineString, P> | null>(null);

  const showPlacePopover = !!(renderPopoverPlace && hoveredPlace);
  const showVoyagePopover = !!(renderPopoverVoyage && hoveredVoyage);
  const isPreviewOpen = showPlacePopover || showVoyagePopover;

  function close() {
    setIsHovered(false);
    setKeyboardPreview(false);
    setHoveredPlace(null);
    setHoveredVoyage(null);
  }
  function commitZoom() {
    const value = Number(zoomInput ?? zoomPercent);
    if (zoomInput !== '' && Number.isFinite(value)) {
      close();
      mapInteractionRef.current?.zoomTo(value / 100);
    }
    setZoomInput(null);
  }
  function handleLeave() {
    setIsHovered(false);
  }
  function handleHover(e: MouseEvent<HTMLCanvasElement>) {
    const interaction = mapInteractionRef.current;
    const canvas = canvasRef.current;
    if (!interaction || !canvas) {return;}
    const place = interaction.overPlace(e.nativeEvent);
    const voyage = place ? null : interaction.overVoyage(e.nativeEvent);
    if (!place && !voyage) { handleLeave(); return; }
    setIsHovered(true);
    setKeyboardPreview(false);
    if (place !== hoveredPlace || voyage !== hoveredVoyage) {
      previewTrigger.current = canvas;
      if (place && places) {selectedPlace.current = places.features.indexOf(place);}
      const rect = canvas.getBoundingClientRect();
      setCoordinates([e.clientX - rect.left + canvas.offsetLeft, e.clientY - rect.top + canvas.offsetTop]);
      setHoveredPlace(place);
      setHoveredVoyage(voyage);
    }
  }

  function handleClick(e: MouseEvent<HTMLCanvasElement>) {
    handleHover(e);
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

  function previewPlace(offset = 0, index?: number) {
    const features = places?.features;
    const canvas = canvasRef.current;
    if (!features?.length || !canvas || !renderPopoverPlace) {return;}
    selectedPlace.current = index ?? (selectedPlace.current + offset + features.length) % features.length;
    const place = features[selectedPlace.current];
    previewTrigger.current = document.activeElement instanceof HTMLElement && canvas.parentElement?.contains(document.activeElement)
      ? document.activeElement : canvas;
    setIsHovered(true);
    setKeyboardPreview(true);
    mapInteractionRef.current?.rotateTo(place.geometry.coordinates as [number, number]);
    setCoordinates([canvas.offsetLeft + canvas.clientWidth / 2, canvas.offsetTop + canvas.clientHeight / 2]);
    setHoveredPlace(place);
    setHoveredVoyage(null);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {return;}
    const interaction = drawMap<P>(canvas, places, voyages, setZoomPercent);
    selectedPlace.current = 0;
    mapInteractionRef.current = interaction;
    if (showControls) {interaction.reset();}
    const observer = new ResizeObserver(interaction.resize);
    observer.observe(canvas);
    return () => {
      observer.disconnect();
      interaction.destroy();
      mapInteractionRef.current = null;
    };
  }, [places, voyages, showControls]);
  useImperativeHandle(ref, () => ({
    rotateTo: (coordinates: [number, number]) => {
      close();
      if (mapInteractionRef.current) {
        mapInteractionRef.current.rotateTo(coordinates);
      }
    },
  }), []);

  return (
    <div className={cn(classes.worldMap, className)} data-controls={showControls || undefined} style={style}>
      <canvas ref={canvasRef} aria-label={showControls ? 'World globe. Arrow keys rotate; plus and minus zoom; Enter previews a place; square brackets preview previous and next places.' : 'World map'}
        tabIndex={showControls ? 0 : undefined}
        onKeyDown={(event) => {
          if (event.ctrlKey || event.metaKey || event.altKey) {return;}
          const interaction = mapInteractionRef.current;
          if (!showControls || !interaction) {return;}
          if (['Enter', '[', ']'].includes(event.key) && renderPopoverPlace) {
            event.preventDefault();
            previewPlace(event.key === '[' ? -1 : event.key === ']' ? 1 : 0);
            return;
          }
          const rotations: Record<string, [number, number]> = { ArrowLeft: [-15, 0], ArrowRight: [15, 0], ArrowUp: [0, 15], ArrowDown: [0, -15] };
          const rotation = rotations[event.key];
          if (!rotation && !['+', '=', '-'].includes(event.key)) {return;}
          event.preventDefault();
          close();
          if (rotation) {interaction.rotateBy(...rotation);}
          else {interaction.zoomBy(event.key === '-' ? 1 / 1.4 : 1.4);}
        }}
        onPointerDownCapture={close} onWheelCapture={close}
        onMouseMove={handleHover} onMouseLeave={handleLeave} onClick={handleClick}/>
      {showControls && renderPopoverPlace && !!places?.features.length && (
        <ul className={classes.placeList} aria-label="Places on the globe">
          {places.features.map((place, index) => (
            <li key={place.id ?? index}>
              <button type="button" onClick={() => previewPlace(0, index)}>
                {getPlaceLabel?.(place) ?? `Place ${index + 1}`}
              </button>
            </li>
          ))}
        </ul>
      )}
      {showControls && <FloatingToolbar className={classes.controls} role="group" aria-label="Globe controls">
        <div className="zoom-controls">
          <Tooltip label="Zoom out"><ToolButton size="touch" aria-label="Zoom out" icon={<IconZoomOut />} onPress={() => { close(); mapInteractionRef.current?.zoomBy(1 / 1.4); }} /></Tooltip>
          <label className="zoom-field">
            <input className="zoom-input" aria-label="Globe zoom percentage, 100 to 800" inputMode="numeric" pattern="[0-9]*" maxLength={3} type="text"
              value={zoomInput ?? String(zoomPercent)} onChange={(event) => setZoomInput(event.currentTarget.value.replace(/[^\d]/g, ''))}
              onFocus={(event) => event.currentTarget.select()} onBlur={commitZoom}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {event.preventDefault(); commitZoom();}
                else if (event.key === 'Escape') {event.preventDefault(); setZoomInput(null);}
              }} />
            <span className="zoom-suffix" aria-hidden="true">%</span>
          </label>
          <Tooltip label="Zoom in"><ToolButton size="touch" aria-label="Zoom in" icon={<IconZoomIn />} onPress={() => { close(); mapInteractionRef.current?.zoomBy(1.4); }} /></Tooltip>
        </div>
        <span className="toolbar-divider" aria-hidden="true" />
        <Tooltip label="Return to location overview"><ToolButton size="touch" aria-label="Reset globe to location overview" icon={<IconReset />} onPress={() => { close(); setZoomInput(null); selectedPlace.current = 0; mapInteractionRef.current?.reset(); }} /></Tooltip>
      </FloatingToolbar>}

      <span ref={setPopoverAnchor} className={classes.anchor} aria-hidden="true"
        style={{ left: coordinates[0], top: coordinates[1] }}/>
      {isPreviewOpen && popoverAnchor && (
        <PopoverCard key={`${coordinates[0]}-${coordinates[1]}`} anchor={popoverAnchor}
          focusTarget={previewTrigger.current} autoFocus={keyboardPreview}
          isHovered={isHovered} openImmediately label="Map place preview"
          onOpenChange={(open) => { if (!open) {close();} }}>
          <div onKeyDown={(event) => {
            const target = event.target;
            if (event.ctrlKey || event.metaKey || event.altKey
              || target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) {return;}
            if (event.key === '[' || event.key === ']') {
              event.preventDefault();
              previewPlace(event.key === '[' ? -1 : 1);
            }
          }}>
            {showPlacePopover ? renderPopoverPlace(hoveredPlace)
              : showVoyagePopover ? renderPopoverVoyage(hoveredVoyage) : null}
          </div>
        </PopoverCard>
      )}
    </div>
  );
}
