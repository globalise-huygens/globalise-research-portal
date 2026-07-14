import { create } from 'zustand';
import { EntityHighlightSlice, defaultEntityHighlightSlice } from './EntityHighlightSlice';
import { LayoutElementsSlice, defaultLayoutElementsSlice } from './LayoutElementsSlice';
import { ManifestViewerSlice, defaultManifestViewerSlice } from './ManifestViewerSlice';
import { SelectionSlice, defaultSelectionSlice } from './SelectionSlice';

export type DocumentState =
  & EntityHighlightSlice
  & LayoutElementsSlice
  & ManifestViewerSlice
  & SelectionSlice;

export const useDocumentStore = create<DocumentState>(() => ({
  ...defaultEntityHighlightSlice,
  ...defaultLayoutElementsSlice,
  ...defaultManifestViewerSlice,
  ...defaultSelectionSlice,
}));

export const setState = useDocumentStore.setState;
