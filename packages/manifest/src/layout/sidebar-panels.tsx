import * as React from 'react';
import {
  IconInventory,
  IconTableOfContent,
  IconEntities,
  IconEvents,
} from '@globalise/design';
import { ReactNode } from 'react';

export type SidebarId = 'inventory' | 'toc' | 'entities' | 'events';

export type SidebarPanel = {
  id: SidebarId
  icon: ReactNode,
  label: string,
  description: string,
  railLabel?: string,
  badge?: string
  count?: string,
};

export const sidebarPanels = [
  {
    id: 'inventory',
    label: 'Inventory',
    description:
      'View this inventory’s metadata and its place in the archive hierarchy',
    badge: '1664',
    railLabel: '1664',
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
    count: '(376)',
    railLabel: '376',
    icon: <IconEntities className="sidebar-icon" />,
  },
  {
    id: 'events',
    label: 'Event tags',
    description:
      'Explore actions and events recognised in the transcription. Use these tags to find related passages',
    count: '(0)',
    railLabel: '0',
    icon: <IconEvents className="sidebar-icon" />,
  },
] satisfies SidebarPanel[];
