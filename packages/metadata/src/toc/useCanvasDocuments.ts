import { useMemo } from 'react';
import { useToc } from './useToc.ts';
import { toCanvasDocuments } from './toCanvasDocuments.ts';

export function useCanvasDocuments() {
  const toc = useToc();
  return useMemo(() => toCanvasDocuments(toc), [toc]);
}
