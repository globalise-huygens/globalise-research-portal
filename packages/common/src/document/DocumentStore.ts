import { create } from 'zustand';
import { EntityHighlightSlice, defaultEntityHighlightSlice } from './EntityHighlightSlice';
import { LayoutElementsSlice, defaultLayoutElementsSlice } from './LayoutElementsSlice';
import { ManifestViewerSlice, defaultManifestViewerSlice } from './ManifestViewerSlice';
import { SelectionSlice, defaultSelectionSlice } from './SelectionSlice';
import {
  ManifestMetadataSlice,
  defaultManifestMetadataSlice,
} from './ManifestMetadataState';

export type DocumentState =
  & EntityHighlightSlice
  & LayoutElementsSlice
  & ManifestViewerSlice
  & SelectionSlice
  & ManifestMetadataSlice;

export const useDocumentStore = create<DocumentState>(() => ({
  ...defaultEntityHighlightSlice,
  ...defaultLayoutElementsSlice,
  ...defaultManifestViewerSlice,
  ...defaultSelectionSlice,
  ...defaultManifestMetadataSlice,
}));

export const setState = useDocumentStore.setState;
