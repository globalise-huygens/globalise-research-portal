import { LazyCollectionViewer } from './LazyCollectionViewer.tsx';
import { CanvasOverlays } from './CanvasOverlays.tsx';

type Props = {
  initialCanvas: number
  onCanvasChange: (index: number) => void
};

export function ManifestFacsimileViewer(
  { initialCanvas, onCanvasChange }: Props,
) {
  return <LazyCollectionViewer
    scanHeight={0.25}
    initialCanvas={initialCanvas}
    onCanvasChange={onCanvasChange}
  >
    <CanvasOverlays/>
  </LazyCollectionViewer>;
}