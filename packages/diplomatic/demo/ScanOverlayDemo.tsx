import { useEffect, useMemo, useState } from 'react';
import type { Id } from '@globalise/common/annotation';
import {
  setCanvasPages,
  useAnnotations,
  useCanvasIndexes,
  usePartOf,
  useSelectedAnnotationsInDiplomatic,
} from '@globalise/common/document';
import { DiplomaticView } from '../src';
import { RawPathOverlay } from './RawPathOverlay';
import { canvasId, loadAnnotationPages, scanUrl } from './loadAnnotationPages';
import { addToSelection } from './addToSelection.tsx';

const scanOpacity = 50;
const showScanMargin = true;
const words: Id[] = [
  // Batavia (entity):
  'https://data.globalise.huygens.knaw.nl/hdl:20.500.14722/annotations:entities:NL-HaNA_1.04.02_3598_0797#annotation:264',
  // Batavia (word):
  'https://data.globalise.huygens.knaw.nl/hdl:20.500.14722/annotations:transcriptions:NL-HaNA_1.04.02_3598_0797#word_518b66ef-5ea2-45a4-9087-c10461632e1d',
  // Aankomende:
  'https://data.globalise.huygens.knaw.nl/hdl:20.500.14722/annotations:transcriptions:NL-HaNA_1.04.02_3598_0797#word_86188347-1ea2-4e31-88da-73ac85528b0f',
  // Paragraph:
  'https://data.globalise.huygens.knaw.nl/hdl:20.500.14722/annotations:transcriptions:NL-HaNA_1.04.02_3598_0797#region_9d4c539c-336b-4dcb-b37c-58a1f5c0c62b_4',
];

export function ScanOverlayDemo() {
  const [error, setError] = useState<string | null>(null);

  const annotations = useAnnotations(canvasId);
  const indexes = useCanvasIndexes(canvasId);
  const page = usePartOf(canvasId);
  const selected = useSelectedAnnotationsInDiplomatic(canvasId);
  const selectedWords = useMemo(
    () => addToSelection(words, indexes),
    [indexes],
  );

  useEffect(() => {
    void init();

    async function init() {
      try {
        setCanvasPages(canvasId, await loadAnnotationPages());
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unknown error');
      }
    }
  }, []);

  if (error) {
    return <p className="error">{error}</p>;
  }
  if (!page) {
    return <p className="loading">Loading...</p>;
  }

  return <div className="stage" style={{ aspectRatio: `${page.width} / ${page.height}` }}>
    <img
      className="scan" src={scanUrl} alt="scan"
      style={{ opacity: scanOpacity / 100 }}
    />
    <DiplomaticView
      annotations={annotations}
      page={page}
      selected={[...selectedWords, ...selected.all]}
      fit="width"
      showBlocks
      showScanMargin={showScanMargin}
      style={{ opacity: (100 - scanOpacity) / 100 }}
    />
    <RawPathOverlay annotations={annotations} page={page} ids={words}/>
  </div>;
}
