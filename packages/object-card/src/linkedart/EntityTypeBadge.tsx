import { EntityBadge } from '@globalise/design';
import { getEntityBadgeType, LinkedArtEntityType } from '@globalise/common';

type EntityTypeBadgeProps = {
  type: LinkedArtEntityType;
};

export function EntityTypeBadge({ type }: EntityTypeBadgeProps) {
  const badgeType = getEntityBadgeType(type);
  if (!badgeType) {
    return null;
  }
  return <EntityBadge type={badgeType}>{type}</EntityBadge>;
}
