import { createContext, useContext } from 'react';

export type ReadingLayout = {
  scanFit: ScanFit;
  tools: ReadingTools | null;
};

export type ScanFit = 'height' | 'width';

export type ReadingTools = {
  id: string;
  isOpen: boolean;
  onClose: () => void;
};

const defaultReadingLayout: ReadingLayout = {
  scanFit: 'height',
  tools: null,
};

export const ReadingLayoutContext = createContext<ReadingLayout>(defaultReadingLayout);

export function useReadingLayout(): ReadingLayout {
  return useContext(ReadingLayoutContext);
}
