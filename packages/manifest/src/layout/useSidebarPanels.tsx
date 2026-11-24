import * as React from 'react';
import {
  IconInventory,
  IconTableOfContent,
  IconEntities,
  IconEvents,
} from '@globalise/design';
import { ReactNode } from 'react';
import { useManifest } from '@knaw-huc/osd-iiif-viewer';
import { findMetadataValue } from '@globalise/metadata';
import { DocumentBadge, SidebarBadge } from './SidebarBadge.tsx';

export type SidebarId = 'inventory' | 'toc' | 'classified' | 'identified';

export type SidebarPanel = {
  id: SidebarId
  icon: ReactNode,
  hasHeaderIcon: boolean,
  label: string,
  shortLabel: string,
  description: string,
  railLabel?: string,
  badge?: ReactNode
};

const sidebarPanels: SidebarPanel[] = [
  {
    id: 'inventory',
    label: 'Inventory',
    shortLabel: 'Inventory',
    description:
      'View this inventory’s metadata and its place in the archive hierarchy',
    icon: <IconInventory className="sidebar-icon" />,
    hasHeaderIcon: true,
  },
  {
    id: 'toc',
    label: 'Table of Contents',
    shortLabel: 'Contents',
    description:
      'Browse the documents in this inventory in archival order. Select a document to explore its metadata and scans',
    icon: <IconTableOfContent className="sidebar-icon" />,
    hasHeaderIcon: true,
  },
  {
    id: 'classified',
    label: 'Classified as',
    shortLabel: 'Classified',
    description:
      'Explore the marked NER categories in the current document.',
    icon: <IconEntities className="sidebar-icon" />,
    hasHeaderIcon: false,
    badge: <DocumentBadge />,
  },
  {
    id: 'identified',
    label: 'Identified as',
    shortLabel: 'Identified',
    description:
      'Explore the recognized entities in the current document.',
    icon: <IconEvents className="sidebar-icon" />,
    hasHeaderIcon: false,
    badge: <DocumentBadge />,
  },
];

export function useSidebarPanels(): SidebarPanel[] {
  const inventoryNumber = useInventoryNumber();
  return sidebarPanels.map((panel) => panel.id === 'inventory' && inventoryNumber
    ? { ...panel, badge: <SidebarBadge label={inventoryNumber} />, railLabel: inventoryNumber }
    : panel);
}

function useInventoryNumber(): string | undefined {
  const { vault, id, isReady } = useManifest();
  const manifest = isReady ? vault.get({ id, type: 'Manifest' }) : undefined;
  return manifest && findMetadataValue(manifest.metadata, 'Inventory number', 'Inventarisnummer');
}
