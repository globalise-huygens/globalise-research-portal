import * as React from 'react';
import {
  DocumentDetailMetadataSidebar,
  DocumentDetailMetadataSidebarButton,
  DocumentDetailMetadataSidebarBadge,
} from '@globalise/design-system';
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
    <DocumentDetailMetadataSidebar className="w-full overflow-hidden border-r-0">
      {sideBarPanels.map((item) => {
        const isExpanded = expandedSections.has(item.id);
        const panelId = `${item.id}-panel`;

        return (
          <React.Fragment key={item.id}>
            <DocumentDetailMetadataSidebarButton
              aria-controls={panelId}
              aria-expanded={isExpanded}
              className="h-s64 shrink-0"
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
                className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden border-b border-brand-white/10 bg-neutral-800 text-brand-white [scrollbar-color:var(--neutral-600)_transparent] [scrollbar-width:thin]"
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
