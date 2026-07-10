import { create } from 'zustand';
import { EntityHighlightSlice, defaultEntityHighlightSlice } from './EntityHighlightSlice';
import { ManifestViewerSlice, defaultManifestViewerSlice } from './ManifestViewerSlice';
import { SelectionSlice, defaultSelectionSlice } from './SelectionSlice';

export type DocumentState =
  & EntityHighlightSlice
  & ManifestViewerSlice
  & SelectionSlice;

export const useDocumentStore = create<DocumentState>(() => ({
  ...defaultEntityHighlightSlice,
  ...defaultManifestViewerSlice,
  ...defaultSelectionSlice,
}));

export const setState = useDocumentStore.setState;
