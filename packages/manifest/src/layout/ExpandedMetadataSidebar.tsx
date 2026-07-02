import * as React from 'react';
import {
  DocumentDetailMetadataSidebar,
  DocumentDetailMetadataSidebarButton,
  DocumentDetailMetadataSidebarBadge,
} from '@globalise/design';
import { sideBarPanels } from './sideBarPanels.tsx';
import { SidebarDisclosureIcon } from './SidebarDisclosureIcon';

export function ExpandedMetadataSidebar({
  expandedSections,
  onToggleSection,
}: {
  expandedSections: Set<string>;
  onToggleSection: (sectionId: string) => void;
}) {
  return (
    <DocumentDetailMetadataSidebar className="manifest-document-layout__expanded-sidebar">
      {sideBarPanels.map((item) => {
        const isExpanded = expandedSections.has(item.id);
        const panelId = `${item.id}-panel`;

        return (
          <React.Fragment key={item.id}>
            <DocumentDetailMetadataSidebarButton
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
                <DocumentDetailMetadataSidebarBadge>
                  {item.badge}
                </DocumentDetailMetadataSidebarBadge>
              )}
            </DocumentDetailMetadataSidebarButton>

            {isExpanded && (
              <div
                id={panelId}
                role="region"
                aria-label={`${item.label} details`}
                className="manifest-document-layout__sidebar-panel"
              >
                TODO: {panelId} content
              </div>
            )}
          </React.Fragment>
        );
      })}
    </DocumentDetailMetadataSidebar>
  );
}
