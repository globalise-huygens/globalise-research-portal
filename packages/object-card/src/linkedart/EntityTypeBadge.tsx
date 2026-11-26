import {
  EntityBadge,
  EntityBadgeType,
  IconEntityPerson,
  IconEntityShip,
  IconEntityPlace,
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
  const icons = {
    person: IconEntityPerson,
    ship: IconEntityShip,
    place: IconEntityPlace,
  };
  const Icon = icons[type as keyof typeof icons];
  return (
    <EntityBadge type={badgeType} icon={Icon && <Icon aria-hidden="true" />}>
      {type}
    </EntityBadge>
  );
}
