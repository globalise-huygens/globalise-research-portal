import * as React from 'react';
import { DocumentDetailIconRail, DocumentDetailRailButton } from '@globalise/design-system';
import { sideBarPanels } from './sideBarPanels.tsx';

export function CollapsedMetadataRail({
  onExpandSection,
}: {
  onExpandSection: (sectionId: string) => void;
}) {
  return (
    <DocumentDetailIconRail className="h-full w-full border-r-0 bg-neutral-900">
      {sideBarPanels.map((item) => (
        <DocumentDetailRailButton
          key={item.id}
          aria-label={`Expand ${item.label}`}
          className="border-b-0"
          icon={item.icon}
          label={item.railLabel}
          onPress={() => onExpandSection(item.id)}
        />
      ))}
    </DocumentDetailIconRail>
  );
}
