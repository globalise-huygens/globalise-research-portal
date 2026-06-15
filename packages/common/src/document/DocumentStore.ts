import { create } from 'zustand';
import { ManifestViewerSlice, defaultManifestViewerSlice } from './ManifestViewerSlice';
import { SelectionSlice, defaultSelectionSlice } from './SelectionSlice';

export type DocumentState = ManifestViewerSlice & SelectionSlice;

export const useDocumentStore = create<DocumentState>(() => ({
  ...defaultManifestViewerSlice,
  ...defaultSelectionSlice,
}));

export const setState = useDocumentStore.setState;
