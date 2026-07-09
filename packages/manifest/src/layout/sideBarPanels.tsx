import * as React from 'react';
import {
  IconInventory,
  IconTableOfContent,
  IconEntities,
  IconEvents,
} from '@globalise/design';

export const sideBarPanels = [
  {
    id: 'inventory',
    label: 'Inventory',
    badge: '',
    railLabel: '1664',
    icon: <IconInventory className="manifest-document-layout__sidebar-icon" />,
    count: 0,
  },
  {
    id: 'table-of-contents',
    label: 'Table of Contents',
    badge: '',
    railLabel: 'rail label?',
    icon: <IconTableOfContent className="manifest-document-layout__sidebar-icon" />,
    count: 0,
  },
  {
    id: 'entity-tags',
    label: 'Entity tags',
    railLabel: '376',
    badge: 'badge',
    icon: <IconEntities className="manifest-document-layout__sidebar-icon" />,
    count: 0,
  },
  {
    id: 'events',
    label: 'Event tags',
    railLabel: '0',
    badge: '',
    icon: <IconEvents className="manifest-document-layout__sidebar-icon" />,
    count: 0,
  },
] as const;
