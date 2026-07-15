import { create } from 'zustand';
import { EntityHighlightSlice, defaultEntityHighlightSlice } from './EntityHighlightSlice';
import { LayoutElementsSlice, defaultLayoutElementsSlice } from './LayoutElementsSlice';
import { ManifestViewerSlice, defaultManifestViewerSlice } from './ManifestViewerSlice';
import { SelectionSlice, defaultSelectionSlice } from './SelectionSlice';
import {
  ManifestMetadataSlice,
  defaultManifestMetadataSlice,
} from './ManifestMetadataState';
import { TocSlice, defaultTocSlice } from './TocSlice';

export type DocumentState =
  & EntityHighlightSlice
  & LayoutElementsSlice
  & ManifestViewerSlice
  & SelectionSlice
  & ManifestMetadataSlice
  & TocSlice;

export const useDocumentStore = create<DocumentState>(() => ({
  ...defaultEntityHighlightSlice,
  ...defaultLayoutElementsSlice,
  ...defaultManifestViewerSlice,
  ...defaultSelectionSlice,
  ...defaultManifestMetadataSlice,
  ...defaultTocSlice,
}));

export const setState = useDocumentStore.setState;