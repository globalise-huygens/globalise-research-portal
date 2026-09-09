import {
  IconEntities,
  IconEntityCommodity,
  IconEntityDate,
  IconEntityDimensions,
  IconEntityDocument,
  IconEntityOrganisation,
  IconEntityPerson,
  IconEntityPlace,
  IconEntityShip,
} from '../icons';

const entityPresentation = {
  entity: { label: 'Entity', Icon: IconEntities },
  commodity: { label: 'Commodity', Icon: IconEntityCommodity },
  date: { label: 'Date', Icon: IconEntityDate },
  dimensions: { label: 'Measure', Icon: IconEntityDimensions },
  document: { label: 'Document', Icon: IconEntityDocument },
  organisation: { label: 'Organisation', Icon: IconEntityOrganisation },
  person: { label: 'Person', Icon: IconEntityPerson },
  place: { label: 'Place', Icon: IconEntityPlace },
  polity: { label: 'Polity', Icon: IconEntityOrganisation },
  quantity: { label: 'Quantity', Icon: IconEntityDimensions },
  ship: { label: 'Ship', Icon: IconEntityShip },
};

export type EntityType = keyof typeof entityPresentation;

export function getEntityTypeLabel(type: EntityType) {
  return entityPresentation[type].label;
}

export function EntityIcon({ type, className }: {
  type: EntityType;
  className?: string;
}) {
  const { Icon } = entityPresentation[type];
  return <Icon className={className} />;
}
