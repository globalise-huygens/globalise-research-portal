import { Annotation, Body } from './AnnoModel.ts';
import { asArray } from './asArray.ts';

export type EntityBody = {
  type: EntityType;
  classified_as: EntityClassification;
};
type EntityClassification = {
  id: string;
  type: string;
  _label: string;
};
const entityTypes = [
  'AppellativeStatus',
  'ClassificatoryStatus',
  'Dimension',
] as const;

export type EntityType = (typeof entityTypes)[number];
export const entityVisualCategories = [
  'cidoc-actor',
  'cidoc-appellation',
  'cidoc-conceptual-object',
  'cidoc-dimension',
  'cidoc-physical-thing',
  'cidoc-place',
  'cidoc-time-span',
  'cidoc-type',
] as const;

export type EntityVisualCategoryClassName =
  (typeof entityVisualCategories)[number];

export function assertEntityBody(
  body: Body | undefined,
): asserts body is EntityBody {
  if (!isEntityBody(body)) {
    throw new Error('Expected EntityBody');
  }
}

export const isEntityBody = (body: Body | undefined): body is EntityBody => {
  if (!body) {
    return false;
  }
  const entityBody = body as EntityBody;
  return entityTypes.includes(entityBody.type);
};

export const isEntity = (
  annotation: Annotation,
): annotation is Annotation<EntityBody> => getEntityBodies(annotation).length > 0;

export function getEntityBodies(annotation: Annotation): EntityBody[] {
  return asArray(annotation.body).filter(isEntityBody);
}

export function getPrimaryEntityBody(annotation: Annotation): EntityBody {
  const bodies = getEntityBodies(annotation);
  const body = bodies.find((current) => current.type === 'Dimension')
    ?? bodies.find((current) => current.type === 'ClassificatoryStatus')
    ?? bodies.find((current) => current.type === 'AppellativeStatus');
  assertEntityBody(body);
  return body;
}

export function getEntityType(annotation: Annotation) {
  return getPrimaryEntityBody(annotation).type;
}

export function getEntityTypeClassName(annotation: Annotation) {
  switch (getEntityType(annotation)) {
    case 'AppellativeStatus':
      return 'appellative-status';
    case 'ClassificatoryStatus':
      return 'classificatory-status';
    case 'Dimension':
      return 'dimension';
  }
}

const ENTITY_CLASSNAMES: Record<string, EntityVisualCategoryClassName> = {
  'gan:DATE': 'cidoc-time-span',
  'gan:PER_NAME': 'cidoc-actor',
  'gan:ORG': 'cidoc-actor',
  'gan:LOC_NAME': 'cidoc-place',
  'gan:LOC_ADJ': 'cidoc-place',
  'gan:DOC': 'cidoc-conceptual-object',
  'gan:CMTY_QUANT': 'cidoc-dimension',
  'gan:CMTY_NAME': 'cidoc-physical-thing',
  'gan:SHIP': 'cidoc-physical-thing',
  'gan:CMTY_QUAL': 'cidoc-type',
  'gan:PER_ATTR': 'cidoc-type',
  'gan:PRF': 'cidoc-type',
  'gan:SHIP_TYPE': 'cidoc-type',
  'gan:STATUS': 'cidoc-type',
};

export function getEntityClassifiedAsClassName(
  annotation: Annotation,
): EntityVisualCategoryClassName {
  const body = getPrimaryEntityBody(annotation);
  return (
    ENTITY_CLASSNAMES[body.classified_as.id] ??
    getFallbackVisualCategory(body.type)
  );
}

export function getEntityClassifiedAsLabel(entity: Annotation) {
  const body = getPrimaryEntityBody(entity);
  return body.classified_as._label;
}

export function isEntityVisualCategory(
  value: string,
): value is EntityVisualCategoryClassName {
  return entityVisualCategories.includes(
    value as EntityVisualCategoryClassName,
  );
}

function getFallbackVisualCategory(
  type: EntityType,
): EntityVisualCategoryClassName {
  switch (type) {
    case 'AppellativeStatus':
      return 'cidoc-appellation';
    case 'ClassificatoryStatus':
      return 'cidoc-type';
    case 'Dimension':
      return 'cidoc-dimension';
  }
}
