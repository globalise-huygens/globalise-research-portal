import { Annotation, Body } from './AnnoModel.ts';
import { asArray } from './asArray.ts';
import {
  CidocEntityClassificationId,
  getCidocEntityClassificationId,
} from './CidocEntityModel.ts';

export type EntityBody = {
  type: EntityAnnotationBodyType;
  classified_as: EntityClassification;
  ascribes_classification: {
    id: string,
    type: string,
    _label: string
  }
};

export type EntityClassification = {
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

export function isHighlightedEntity(
  annotation: Annotation,
  categories: Set<CidocEntityClassificationId>,
): boolean {
  if (!isEntity(annotation)) {
    return false;
  }
  const classificationId = getCidocEntityClassificationId(annotation);
  return !!classificationId && categories.has(classificationId);
}