import type { LinkedArtEntityType } from '../linkedart/LinkedArtEntityModel.ts';

export type EntityTagType =
  | 'commodity'
  | 'date'
  | 'dimensions'
  | 'document'
  | 'organisation'
  | 'person'
  | 'place'
  | 'ship';

const tagTypeByEntityType: Partial<Record<LinkedArtEntityType, EntityTagType>> = {
  person: 'person',
  place: 'place',
  organization: 'organisation',
  ship: 'ship',
};

const badgeTypeByEntityType = {
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
} as const satisfies Record<LinkedArtEntityType, string | null>;

export function getEntityTagType(type: LinkedArtEntityType): EntityTagType | undefined {
  return tagTypeByEntityType[type];
}

export function getEntityBadgeType(type: LinkedArtEntityType) {
  return badgeTypeByEntityType[type];
}
