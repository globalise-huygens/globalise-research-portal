import { getEntityTagType } from '@globalise/common';
import { EntityTag } from '@globalise/design';
import { toHref } from '@globalise/router';
import type { LinkedEntity } from './EntityPanelModel.ts';
import { useIdentifiedPanel } from './useIdentifiedPanel.ts';

export function IdentifiedPanel() {
  const { document, linkedEntities } = useIdentifiedPanel();

  if (!document) {
    return <div className="toc-empty">No document on this scan.</div>;
  }

  return (
    <div className="metadata-panel entity-panel">
      <ul>
        {linkedEntities.map((entity) => (
          <LinkedEntityItem key={entity.id} entity={entity}/>
        ))}
      </ul>
    </div>
  );
}

type LinkedEntityItemProps = {
  entity: LinkedEntity;
};

function LinkedEntityItem({ entity }: LinkedEntityItemProps) {
  const { id, type, label, mentions } = entity;
  const total = mentions.length;
  const tagType = getEntityTagType(type);
  const href = toHref({ to: '/object-card', search: { uri: id } });
  const title = `The current document refers to ${label} ${total} times`;

  return (
    <li title={title}>
      <EntityTag type={tagType} href={href}>{label}</EntityTag> ({total})
    </li>
  );
}
