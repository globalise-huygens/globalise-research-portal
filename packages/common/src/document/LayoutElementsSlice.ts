import { setState, useDocumentStore } from './DocumentStore';

export type LayoutElementsSlice = {
  isLayoutElementsVisible: boolean;
};

export const defaultLayoutElementsSlice: LayoutElementsSlice = {
  isLayoutElementsVisible: true,
};

export function setLayoutElementsVisible(isLayoutElementsVisible: boolean) {
  setState({ isLayoutElementsVisible });
}

export function useIsLayoutElementsVisible() {
  return useDocumentStore((s) => s.isLayoutElementsVisible);
}
