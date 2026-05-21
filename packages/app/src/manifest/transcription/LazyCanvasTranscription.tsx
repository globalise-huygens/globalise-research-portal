import {useEffect, useRef, useState} from 'react';
import {
  loadCanvas,
  useDocumentStore,
  usePages,
} from '@globalise/common/document';
import {TranscriptionPlaceholder} from "./TranscriptionPlaceholder.tsx";
import {PageLabel} from "./PageLabel.tsx";
import {CanvasTranscription} from "./CanvasTranscription.tsx";

type Props = {
  canvasId: string;
  canvasWidth: number;
  canvasHeight: number;
  containerWidth: number;
  annotationUrls: string[];
  index: number;
  scaleFactor: number;
};

export function LazyCanvasTranscription(
  {
    canvasId,
    canvasWidth,
    canvasHeight,
    annotationUrls,
    containerWidth,
    index,
    scaleFactor,
  }: Props
) {
  const {isLoadable, isNearViewport} = useIsLoadableWithDistanceDelay(index);

  const {isReady: isCanvasReady, error, hasAnnotations} = usePages(canvasId);

  useEffect(() => {
    if (isLoadable && annotationUrls.length) {
      loadCanvas(canvasId, annotationUrls);
    }
  }, [isLoadable, canvasId, annotationUrls]);

  const width = containerWidth * scaleFactor;
  const height = (canvasHeight / canvasWidth) * width;

  const isReady = isCanvasReady && hasAnnotations;

  if (!isNearViewport) {
    return <TranscriptionPlaceholder
      width={width}
      height={height}
    />
  }

  if (!annotationUrls.length) {
    return (
      <TranscriptionPlaceholder width={width} height={height}>
        <PageLabel label={index} />
        No transcription
      </TranscriptionPlaceholder>
    );
  }

  if (error) {
    return (
      <TranscriptionPlaceholder
        width={width}
        height={height}
        color="indianred"
        background="rgb(248 243 243)"
      >
        <PageLabel label={index} />
        Error: {error}
      </TranscriptionPlaceholder>
    );
  }

  if (!isReady) {
    return (
      <TranscriptionPlaceholder width={width} height={height}>
        Loading...
      </TranscriptionPlaceholder>
    );
  }

  return (
    <div style={{position: 'relative', width}}>
      <PageLabel label={index} />
      <CanvasTranscription canvasId={canvasId} />
    </div>
  );
}

/**
 * Load nearst images first, increase delay according to distance
 *
 * @param index - canvas index
 * @param delay - total delay = distance * delay (ms)
 * @param maxDistance - maximum distance to be loadable
 *
 * @returns {{isLoadable: boolean, isNearViewport: boolean}}
 * - `isLoadable`: Whether the delay has passed and the canvas should start loading.
 * - `isNear`: Whether the canvas is within the allowed maxDistance.
 */
function useIsLoadableWithDistanceDelay(
  index: number,
  delay: number = 25,
  maxDistance: number = 2
) {
  const distance = useDocumentStore(s => Math.abs(index - s.selectedCanvas));

  const [isLoadable, setIsLoadable] = useState(false);
  const isNear = distance <= maxDistance;

  useEffect(() => {
    if (isLoadable || !isNear) return;

    if (distance === 0) {
      setIsLoadable(true);
      return;
    }

    const timer = setTimeout(() => {
      setIsLoadable(true);
    }, distance * delay);

    return () => clearTimeout(timer);
  }, [distance, isNear, isLoadable, delay]);

  return {isLoadable, isNearViewport: isNear};
}
