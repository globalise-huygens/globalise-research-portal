import { create } from 'zustand';
import { EntityHighlightSlice, defaultEntityHighlightSlice } from './EntityHighlightSlice';
import { LayoutElementsSlice, defaultLayoutElementsSlice } from './LayoutElementsSlice';
import { ManifestViewerSlice, defaultManifestViewerSlice } from './ManifestViewerSlice';
import { SelectionSlice, defaultSelectionSlice } from './SelectionSlice';
import { TocSlice, defaultTocSlice } from './TocSlice';
import { MetadataSlice } from './ManifestMetadataSlice.ts';

export type DocumentState =
  & EntityHighlightSlice
  & LayoutElementsSlice
  & ManifestViewerSlice
  & SelectionSlice
  & MetadataSlice
  & TocSlice;

export const useDocumentStore = create<DocumentState>(() => ({
  ...defaultEntityHighlightSlice,
  ...defaultLayoutElementsSlice,
  ...defaultManifestViewerSlice,
  ...defaultSelectionSlice,
  ...{ metadata: {} },
  ...defaultTocSlice,
}));

export const setState = useDocumentStore.setState;