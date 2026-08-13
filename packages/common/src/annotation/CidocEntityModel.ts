import { Annotation } from './AnnoModel.ts';
import {
  EntityAnnotationBodyType,
  getPrimaryEntityBody,
} from './EntityModel.ts';

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

export type CidocEntityClassificationId =
  keyof typeof cidocClassNameByClassificationId;

export const cidocEntityClassificationIds = Object.keys(
  cidocClassNameByClassificationId,
) as CidocEntityClassificationId[];

export function getCidocClassName(
  annotation: Annotation,
): CidocClassName {
  const body = getPrimaryEntityBody(annotation);
  const id = body.classified_as.id;
  return isCidocEntityClassificationId(id)
    ? getCidocClassNameByClassificationId(id)
    : getFallbackCidocClassName(body.type);
}

export function getCidocClassNameByClassificationId(
  classificationId: CidocEntityClassificationId,
) {
  return cidocClassNameByClassificationId[classificationId];
}

export function getCidocEntityClassificationId(
  annotation: Annotation,
): CidocEntityClassificationId | undefined {
  const id = getPrimaryEntityBody(annotation).classified_as.id;
  return isCidocEntityClassificationId(id) ? id : undefined;
}

export function getCidocEntityClassifiedAsLabel(entity: Annotation) {
  const body = getPrimaryEntityBody(entity);
  return body.classified_as._label;
}

export function isCidocEntityClassificationId(
  value: string,
): value is CidocEntityClassificationId {
  return cidocEntityClassificationIds.includes(value as CidocEntityClassificationId);
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

