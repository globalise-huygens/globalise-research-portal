import * as React from 'react';
import { IconExpandSection } from '@globalise/design-system';

export function SidebarDisclosureIcon({ isExpanded = false }: { isExpanded?: boolean }) {
  return (
    <IconExpandSection
      className={
        isExpanded
          ? 'manifest-document-layout__sidebar-disclosure manifest-document-layout__sidebar-disclosure--expanded'
          : 'manifest-document-layout__sidebar-disclosure'
      }
    />
  );
}
