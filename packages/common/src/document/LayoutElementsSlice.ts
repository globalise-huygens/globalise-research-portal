import { setState, useDocumentStore } from './DocumentStore';

export type LayoutElementsSlice = {
  isLayoutElementsVisible: boolean;
};

export function setLayoutElementsVisible(isLayoutElementsVisible: boolean) {
  setState({ isLayoutElementsVisible });
}

export function useIsLayoutElementsVisible() {
  return useDocumentStore((s) => s.isLayoutElementsVisible);
}
