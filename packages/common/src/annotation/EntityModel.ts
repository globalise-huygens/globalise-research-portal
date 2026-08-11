import { Annotation, Body } from './AnnoModel.ts';
import { asArray } from './asArray.ts';

export type EntityBody = {
  type: EntityAnnotationBodyType;
  classified_as: EntityClassification;
  ascribes_classification: {
    id: string,
    type: string,
    _label: string
  }
};
type EntityClassification = {
  id: string;
  type: string;
  _label: string;
};
const entityAnnotationBodyTypes = [
  'AppellativeStatus',
  'ClassificatoryStatus',
  'Dimension',
] as const;

export type EntityAnnotationBodyType =
  (typeof entityAnnotationBodyTypes)[number];

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
  return entityAnnotationBodyTypes.includes(entityBody.type);
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

export function getEntityAnnotationBodyType(annotation: Annotation) {
  return getPrimaryEntityBody(annotation).type;
}

export function getEntityAnnotationBodyClassName(annotation: Annotation) {
  switch (getEntityAnnotationBodyType(annotation)) {
    case 'AppellativeStatus':
      return 'appellative-status';
    case 'ClassificatoryStatus':
      return 'classificatory-status';
    case 'Dimension':
      return 'dimension';
  }
}

export const cidocClassNames = [
  'cidoc-actor',
  'cidoc-appellation',
  'cidoc-conceptual-object',
  'cidoc-dimension',
  'cidoc-physical-thing',
  'cidoc-place',
  'cidoc-time-span',
  'cidoc-type',
] as const;

export type CidocClassName = (typeof cidocClassNames)[number];

const cidocClassNameByClassificationId = {
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
  'gan:ETH_REL': 'cidoc-type',
  'gan:PER_ATTR': 'cidoc-type',
  'gan:PRF': 'cidoc-type',
  'gan:SHIP_TYPE': 'cidoc-type',
  'gan:STATUS': 'cidoc-type',
} as const satisfies Record<string, CidocClassName>;

export type EntityClassificationId =
  keyof typeof cidocClassNameByClassificationId;

export const entityClassificationIds = Object.keys(
  cidocClassNameByClassificationId,
) as EntityClassificationId[];

export function getCidocClassName(
  annotation: Annotation,
): CidocClassName {
  const body = getPrimaryEntityBody(annotation);
  const id = body.classified_as.id;
  return isEntityClassificationId(id)
    ? getCidocClassNameByClassificationId(id)
    : getFallbackCidocClassName(body.type);
}

export function getCidocClassNameByClassificationId(
  classificationId: EntityClassificationId,
) {
  return cidocClassNameByClassificationId[classificationId];
}

export function getEntityClassificationId(
  annotation: Annotation,
): EntityClassificationId | undefined {
  const id = getPrimaryEntityBody(annotation).classified_as.id;
  return isEntityClassificationId(id) ? id : undefined;
}

export function getEntityClassifiedAsLabel(entity: Annotation) {
  const body = getPrimaryEntityBody(entity);
  return body.classified_as._label;
}

export function isEntityClassificationId(
  value: string,
): value is EntityClassificationId {
  return entityClassificationIds.includes(value as EntityClassificationId);
}

function getFallbackCidocClassName(
  type: EntityAnnotationBodyType,
): CidocClassName {
  switch (type) {
    case 'AppellativeStatus':
      return 'cidoc-appellation';
    case 'ClassificatoryStatus':
      return 'cidoc-type';
    case 'Dimension':
      return 'cidoc-dimension';
  }
}

export function isHighlightedEntity(
  annotation: Annotation,
  categories: Set<EntityClassificationId>,
): boolean {
  if (!isEntity(annotation)) {
    return false;
  }
  const classificationId = getEntityClassificationId(annotation);
  return !!classificationId && categories.has(classificationId);
}
