import * as React from 'react';
import { ViewerIconRail, ViewerRailButton } from '@globalise/design';
import { sideBarPanels } from './sideBarPanels.tsx';

export function CollapsedMetadataRail({
  onExpandSection,
}: {
  onExpandSection: (sectionId: string) => void;
}) {
  return (
    <ViewerIconRail className="manifest-document-layout__collapsed-rail">
      {sideBarPanels.map((item) => (
        <ViewerRailButton
          key={item.id}
          aria-label={`Expand ${item.label}`}
          className="manifest-document-layout__rail-button"
          icon={item.icon}
          label={item.railLabel}
          onPress={() => onExpandSection(item.id)}
        />
      ))}
    </ViewerIconRail>
  );
}
