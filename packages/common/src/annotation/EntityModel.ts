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

export function getEntityCategory(annotation: Annotation) {
  return getPrimaryEntityBody(annotation).type;
}

export function getEntityCategoryClassName(annotation: Annotation) {
  switch (getEntityCategory(annotation)) {
    case 'AppellativeStatus':
      return 'appellative-status';
    case 'ClassificatoryStatus':
      return 'classificatory-status';
    case 'Dimension':
      return 'dimension';
  }
}

export function getEntityVisualCategoryClassName(
  annotation: Annotation,
): EntityVisualCategoryClassName {
  const body = getPrimaryEntityBody(annotation);

  switch (getClassificationCode(body.classified_as.id)) {
    case 'DATE':
      return 'cidoc-time-span';
    case 'PER_NAME':
    case 'ORG':
      return 'cidoc-actor';
    case 'LOC_NAME':
    case 'LOC_ADJ':
      return 'cidoc-place';
    case 'DOC':
      return 'cidoc-conceptual-object';
    case 'CMTY_QUANT':
      return 'cidoc-dimension';
    case 'CMTY_NAME':
    case 'SHIP':
      return 'cidoc-physical-thing';
    case 'CMTY_QUAL':
    case 'ETH_REL':
    case 'PER_ATTR':
    case 'PRF':
    case 'SHIP_TYPE':
    case 'STATUS':
      return 'cidoc-type';
    default:
      return getFallbackVisualCategory(body.type);
  }
}

export function isEntityVisualCategory(
  value: string,
): value is EntityVisualCategoryClassName {
  return entityVisualCategories.includes(
    value as EntityVisualCategoryClassName,
  );
}

function getClassificationCode(classificationId: string) {
  return classificationId.replace(/^.*[:/#]/, '');
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
