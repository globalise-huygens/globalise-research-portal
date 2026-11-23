import { setState, useDocumentStore } from './DocumentStore';

export type ReadingModeSlice = {
  isInReadingMode: boolean;
};

export function setInReadingMode(isInReadingMode: boolean) {
  setState({
    isInReadingMode,
    // In reading mode no hovered elements:
    hovered: null,
  });
}

export function useIsInReadingMode() {
  return useDocumentStore((s) => s.isInReadingMode);
}
