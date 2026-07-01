import * as React from 'react';
import {
  IconInventory,
  IconTableOfContent,
  IconEntities,
  IconEvents,
} from '@globalise/design-system';

export const sideBarPanels = [
  {
    id: 'inventory',
    label: 'Inventory',
    badge: '1664',
    railLabel: '1664',
    icon: <IconInventory className="h-s20 w-s20" />,
  },
  {
    id: 'table-of-contents',
    label: 'Table of Contents',
    icon: <IconTableOfContent className="h-s20 w-s20" />,
  },
  {
    id: 'entity-tags',
    label: 'Entity tags',
    count: '(376)',
    railLabel: '376',
    icon: <IconEntities className="h-s20 w-s20" />,
  },
  {
    id: 'events',
    label: 'Event tags',
    count: '(0)',
    railLabel: '0',
    icon: <IconEvents className="h-s20 w-s20" />,
  },
];
