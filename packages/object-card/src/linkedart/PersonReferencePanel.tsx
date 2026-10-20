import type { LinkedArtNode } from '@globalise/common';
import { ReferencePanel, type ReferencePanelItemData } from '@globalise/design';
import { useEffect, useState } from 'react';
import { getPersonReferenceLinks, loadPersonReferences } from './PersonReferenceModel.ts';

export function PersonReferencePanel({ entity }: { entity: LinkedArtNode }) {
  const [resolved, setResolved] = useState<{
    entity: LinkedArtNode;
    items: ReferencePanelItemData[];
  }>();

  useEffect(() => {
    let active = true;
    void loadPersonReferences(entity).then((items) => {
      if (active) {
        setResolved({ entity, items });
      }
    });
    return () => { active = false; };
  }, [entity]);

  return (
    <ReferencePanel
      title="References"
      className="person-reference-panel"
      items={resolved?.entity === entity ? resolved.items : getPersonReferenceLinks(entity)}
      progressiveLoading
    />
  );
}
