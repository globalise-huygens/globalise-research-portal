import { setState, useDocumentStore } from './DocumentStore';

export type LayoutElementsSlice = {
  isLayoutElementsVisible: boolean;
};

export function setLayoutElementsVisible(isLayoutElementsVisible: boolean) {
  setState(isLayoutElementsVisible
    ? { isLayoutElementsVisible }
    : { isLayoutElementsVisible, hovered: null });
}

export function useIsLayoutElementsVisible() {
  return useDocumentStore((s) => s.isLayoutElementsVisible);
}
