import * as React from 'react';
import { IconRail, RailButton } from '@globalise/design/viewer';
import { sideBarPanels } from './sideBarPanels.tsx';

export function CollapsedMetadataRail({
  onExpandSection,
}: {
  onExpandSection: (sectionId: string) => void;
}) {
  return (
    <IconRail className="manifest-document-layout__collapsed-rail">
      {sideBarPanels.map((item) => (
        <RailButton
          key={item.id}
          aria-label={`Expand ${item.label}`}
          className="manifest-document-layout__rail-button"
          icon={item.icon}
          label={item.railLabel}
          onPress={() => onExpandSection(item.id)}
        />
      ))}
    </IconRail>
  );
}
