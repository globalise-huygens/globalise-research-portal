import * as React from 'react';
import { IconExpandSection } from '@globalise/design';

export function SidebarDisclosureIcon({ isExpanded = false }: { isExpanded?: boolean }) {
  return (
    <IconExpandSection
      className={
        isExpanded
          ? 'sidebar-disclosure expanded'
          : 'sidebar-disclosure'
      }
    />
  );
}
