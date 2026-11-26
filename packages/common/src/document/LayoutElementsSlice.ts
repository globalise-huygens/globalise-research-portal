import { setState, useDocumentStore } from './DocumentStore';
import { getHoverElement, removeHoverAttribute } from './SelectionAttribute';

export type LayoutElementsSlice = {
  isLayoutElementsVisible: boolean;
};

export function setLayoutElementsVisible(isLayoutElementsVisible: boolean) {
  if (!isLayoutElementsVisible) {
    const anchor = getHoverElement();
    if (anchor) {
      removeHoverAttribute(anchor);
    }
  }
  setState(isLayoutElementsVisible
    ? { isLayoutElementsVisible }
    : { isLayoutElementsVisible, hovered: null });
}

export function useIsLayoutElementsVisible() {
  return useDocumentStore((s) => s.isLayoutElementsVisible);
}
