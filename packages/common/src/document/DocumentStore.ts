import { create } from 'zustand';
import { ManifestViewerSlice, defaultManifestViewerSlice } from './ManifestViewerSlice';
import { SelectionSlice, defaultSelectionSlice } from './SelectionSlice';
import {
  ManifestMetadataSlice,
  defaultManifestMetadataSlice,
} from './ManifestMetadataState';

export type DocumentState =
  & ManifestViewerSlice
  & SelectionSlice
  & ManifestMetadataSlice;

export const useDocumentStore = create<DocumentState>(() => ({
  ...defaultManifestViewerSlice,
  ...defaultSelectionSlice,
  ...defaultManifestMetadataSlice,
}));

export const setState = useDocumentStore.setState;