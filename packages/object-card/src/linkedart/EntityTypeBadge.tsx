import {
  EntityBadge,
  EntityBadgeType,
  IconEntityPerson,
} from '@globalise/design';
import { LinkedArtEntityType } from '@globalise/common';

const badgeByEntityType: Record<LinkedArtEntityType, EntityBadgeType | null> = {
  person: 'person',
  place: 'place',
  organization: 'organisation',
  polity: 'polity',
  rulership: 'rulership',
  ship: 'ship',
  voyage: 'voyage',
  conversion: 'conversion',
  occurrence: 'occurrence',
  concept: 'concept',
  conceptscheme: 'concept',
  collection: 'concept',
  unknown: null,
};

type EntityTypeBadgeProps = {
  type: LinkedArtEntityType;
};

export function EntityTypeBadge({ type }: EntityTypeBadgeProps) {
  const badgeType = badgeByEntityType[type];
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
