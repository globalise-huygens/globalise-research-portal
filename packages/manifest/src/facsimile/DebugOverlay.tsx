import {canvasName} from "@globalise/common/annotation";
import {LazyTiledImage} from "./LazyCollectionViewerModel.ts";
import {Fragment, useMemo} from "react";
import {Rect} from "openseadragon";
import {Overlay} from "@knaw-huc/osd-iiif-viewer";
import {useIsViewerScrolling} from "./useIsViewerScrolling.tsx";
import {usePages} from "@globalise/common/document";
import {lazyCollectionViewerStore} from "./LazyCollectionViewerStore.ts";

export type DebugOverlayProps = {
  lazyCanvas: LazyTiledImage
}

export function DebugOverlay({lazyCanvas}: DebugOverlayProps) {
  const isScrolling = useIsViewerScrolling();
  const {isReady, hasAnnotations} = usePages(lazyCanvas.canvasId);
  const isTileLoaded = lazyCollectionViewerStore(
    (s) => s.loaded.has(lazyCanvas.canvasId),
  );
  const location = useMemo(() => new Rect(0, lazyCanvas.y, 1, lazyCanvas.height), [lazyCanvas.y, lazyCanvas.height]);
  let color: string
  const stats = []
  stats.push('isTileLoaded')
  if (!isTileLoaded) {
    color = `rgba(255, 0, 255, 0.5)`
  } else if (!isReady) {
    color = `rgba(255,0,0,0.5)`
    stats.push('!isReady')
  } else if (!hasAnnotations) {
    stats.push('!hasAnnotations')
    color = `rgba(0,0,255,0.5)`
  } else if (isScrolling) {
    stats.push('isScrolling')
    color = `transparent`
  } else {
    color = `transparent`
  }
  return <Overlay location={location}>
    <InfoOverlay lazyCanvas={lazyCanvas} stats={stats} color={color}/>
  </Overlay>

}

type InfoOverlayProps = {
  lazyCanvas: LazyTiledImage,
  stats: string[],
  color: string
};

export function InfoOverlay({lazyCanvas, stats, color}: InfoOverlayProps) {
  const name = canvasName(lazyCanvas.canvasId);
  return <div style={{
    margin: 0,
    padding: '1em',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    textAlign: 'right',
    fontSize: '0.5em',
    backgroundColor: color
  }}>
    {name}
    <br />
    {stats.map(s => <Fragment key={s}>{s}<br/></Fragment>)}
  </div>
}
