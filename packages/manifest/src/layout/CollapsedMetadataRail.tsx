import * as React from 'react';
import { Tooltip } from '@globalise/design';
import { Button as AriaButton } from 'react-aria-components';
import { sidebarPanels } from './sidebar-panels.tsx';

export function CollapsedMetadataRail({
  onExpandSection,
}: {
  onExpandSection: (sectionId: string) => void;
}) {
  return (
    <nav className="collapsed-rail" aria-label="Document information">
      {sidebarPanels.map((item) => (
        <Tooltip key={item.id} label={item.description} placement="right">
          <AriaButton
            aria-label={`Expand ${item.label}`}
            className="rail-button"
            onPress={() => onExpandSection(item.id)}
          >
            <span className="icon">{item.icon}</span>
            {item.railLabel && (
              <span className="label">{item.railLabel}</span>
            )}
          </AriaButton>
        </Tooltip>
      ))}
    </nav>
  );
}
