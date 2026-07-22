import * as React from 'react';
import { sidebarPanels } from './sidebar-panels.tsx';

export function CollapsedMetadataRail({
  onExpandSection,
}: {
  onExpandSection: (sectionId: string) => void;
}) {
  return (
    <nav className="collapsed-rail" aria-label="Document information">
      {sidebarPanels.map((item) => (
        <button
          type="button"
          key={item.id}
          aria-label={`Expand ${item.label}`}
          className="rail-button"
          onClick={() => onExpandSection(item.id)}
        >
          <span className="icon">{item.icon}</span>
          <span className="label">{item.railLabel}</span>
        </button>
      ))}
    </nav>
  );
}
