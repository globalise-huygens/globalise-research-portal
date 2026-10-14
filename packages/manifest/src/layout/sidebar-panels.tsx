import * as React from 'react';
import {
  IconInventory,
  IconTableOfContent,
  IconEntities,
  IconEvents,
} from '@globalise/design';
import { ReactNode } from 'react';
import { useManifest } from '@knaw-huc/osd-iiif-viewer';

export type SidebarId = 'inventory' | 'toc' | 'entities' | 'events';

export type SidebarPanel = {
  id: SidebarId
  icon: ReactNode,
  label: string,
  description: string,
  railLabel?: string,
  badge?: string
};

export const sidebarPanels = [
  {
    id: 'inventory',
    label: 'Inventory',
    description:
      'View this inventory’s metadata and its place in the archive hierarchy',
    icon: <IconInventory className="sidebar-icon" />,
  },
  {
    id: 'toc',
    label: 'Table of Contents',
    description:
      'Browse the documents in this inventory in archival order. Select a document to explore its metadata and scans',
    icon: <IconTableOfContent className="sidebar-icon" />,
  },
  {
    id: 'entities',
    label: 'Entity tags',
    description:
      'Explore words and phrases recognised in the transcription and linked, where possible, to people, places, dates, objects, and other concepts',
    icon: <IconEntities className="sidebar-icon" />,
  },
  {
    id: 'events',
    label: 'Event tags',
    description:
      'Explore actions and events recognised in the transcription. Use these tags to find related passages',
    icon: <IconEvents className="sidebar-icon" />,
  },
] satisfies SidebarPanel[];

export function useSidebarPanels(): SidebarPanel[] {
  const { vault, id, isReady } = useManifest();
  const manifest = isReady ? vault.get({ id, type: 'Manifest' }) : undefined;
  const inventory = manifest?.metadata?.find((entry) =>
    Object.values(entry.label).flat().some((label) =>
      label === 'Inventory number' || label === 'Inventarisnummer',
    ),
  );
  const number = inventory && Object.values(inventory.value).flat()[0];
  return sidebarPanels.map((panel) => panel.id === 'inventory'
    ? { ...panel, badge: number, railLabel: number }
    : panel);
}
