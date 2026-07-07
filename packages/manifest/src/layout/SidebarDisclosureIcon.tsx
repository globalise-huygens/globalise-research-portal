import * as React from 'react';
import { cn, IconExpandSection } from './designSystemCompat';

export function SidebarDisclosureIcon({ isExpanded = false }: { isExpanded?: boolean }) {
  return (
    <IconExpandSection
      className={cn(
        'h-s20 w-s20 text-current transition-transform duration-100 ease-out motion-reduce:transition-none',
        isExpanded && 'rotate-180',
      )}
    />
  );
}
