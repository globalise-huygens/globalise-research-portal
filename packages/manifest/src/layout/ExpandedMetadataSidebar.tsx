import * as React from 'react';
import { SidebarId, sidebarPanels } from './sidebar-panels.tsx';
import { SidebarDisclosureIcon } from './SidebarDisclosureIcon';
import { MetadataPanel, TocPanel } from '@globalise/metadata';
import { Tooltip } from '@globalise/design';
import { Button as AriaButton } from 'react-aria-components';

export function ExpandedMetadataSidebar({
  expandedSections,
  onToggleSection,
}: {
  expandedSections: Set<string>;
  onToggleSection: (sectionId: string) => void;
}) {
  return (
    <nav className="expanded-sidebar" aria-label="Document information">
      {sidebarPanels.map((item) => {
        const isExpanded = expandedSections.has(item.id);
        const panelId: SidebarId = item.id;

        return (
          <React.Fragment key={item.id}>
            <Tooltip label={item.description} placement="right">
              <AriaButton
                aria-controls={panelId}
                aria-expanded={isExpanded}
                className="sidebar-button"
                onPress={() => onToggleSection(item.id)}
              >
                <span className="content">
                  <span className="icon">{item.icon}</span>
                  <span className="label">{item.label}</span>
                  {item.badge && <span className="badge">{item.badge}</span>}
                </span>
                <SidebarDisclosureIcon isExpanded={isExpanded} />
              </AriaButton>
            </Tooltip>

            {isExpanded && (
              <div
                id={panelId}
                role="region"
                aria-label={`${item.label} details`}
                className="sidebar-panel"
              >
                {panelId === 'inventory' && <MetadataPanel />}
                {panelId === 'toc' && <TocPanel />}
              </div>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
