import { EntityBadge, IconEntityPerson } from '@globalise/design';
import { getEntityBadgeType, LinkedArtEntityType } from '@globalise/common';

type EntityTypeBadgeProps = {
  type: LinkedArtEntityType;
};

export function EntityTypeBadge({ type }: EntityTypeBadgeProps) {
  const badgeType = getEntityBadgeType(type);
  if (!badgeType) {
    return null;
  }
  return (
    <EntityBadge
      type={badgeType}
      icon={type === 'person'
        ? <IconEntityPerson aria-hidden="true" />
        : undefined}
    >
      {type}
    </EntityBadge>
  );
}
