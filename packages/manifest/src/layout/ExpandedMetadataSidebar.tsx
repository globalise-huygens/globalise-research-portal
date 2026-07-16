import * as React from 'react';
import {
  ViewerMetadataSidebar,
  ViewerMetadataSidebarButton,
  ViewerMetadataSidebarBadge,
} from '@globalise/design';
import { sideBarPanels } from './sideBarPanels.tsx';
import { SidebarDisclosureIcon } from './SidebarDisclosureIcon';
import { MetadataPanel } from '@globalise/metadata';

export function ExpandedMetadataSidebar({
  expandedSections,
  onToggleSection,
}: {
  expandedSections: Set<string>;
  onToggleSection: (sectionId: string) => void;
}) {
  return (
    <ViewerMetadataSidebar className="manifest-document-layout__expanded-sidebar">
      {sideBarPanels.map((item) => {
        const isExpanded = expandedSections.has(item.id);
        const panelId: (typeof sideBarPanels)[number]['id'] = item.id;

        return (
          <React.Fragment key={item.id}>
            <ViewerMetadataSidebarButton
              aria-controls={panelId}
              aria-expanded={isExpanded}
              className="manifest-document-layout__sidebar-button"
              icon={item.icon}
              label={item.label}
              count={item.count}
              trailing={<SidebarDisclosureIcon isExpanded={isExpanded} />}
              onPress={() => onToggleSection(item.id)}
            >
              {item.badge && (
                <ViewerMetadataSidebarBadge>
                  {item.badge}
                </ViewerMetadataSidebarBadge>
              )}
            </ViewerMetadataSidebarButton>

            {isExpanded && (
              <div
                id={panelId}
                role="region"
                aria-label={`${item.label} details`}
                className="manifest-document-layout__sidebar-panel"
              >
                {panelId === 'inventory' && (
                  <MetadataPanel />
                )}
              </div>
            )}
          </React.Fragment>
        );
      })}
    </ViewerMetadataSidebar>
  );
}
