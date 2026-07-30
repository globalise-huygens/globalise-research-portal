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
  railLabel?: string,
  badge?: string
};

export const sidebarPanels = [
  {
    id: 'inventory',
    label: 'Inventory',
    badge: '1664',
    railLabel: '1664',
    icon: <IconInventory className="sidebar-icon" />,
  },
  {
    id: 'toc',
    label: 'Table of Contents',
    icon: <IconTableOfContent className="sidebar-icon" />,
  },
  {
    id: 'entities',
    label: 'Entity tags',
    icon: <IconEntities className="sidebar-icon" />,
  },
  {
    id: 'events',
    label: 'Event tags',
    icon: <IconEvents className="sidebar-icon" />,
  },
] satisfies SidebarPanel[];
