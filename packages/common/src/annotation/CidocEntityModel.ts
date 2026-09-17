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

export type EntityPresentationType =
  | 'commodity'
  | 'date'
  | 'dimensions'
  | 'document'
  | 'organisation'
  | 'person'
  | 'place'
  | 'ship';

export type EntityPreviewStrategy =
  | 'classification'
  | 'dimension'
  | 'named';

export type EntityClassificationDefinition = {
  cidocClassName: CidocClassName;
  highlightLabel: string;
  highlightGroup?: {
    id: string;
    label: string;
  };
  presentationType: EntityPresentationType;
  previewStrategy: EntityPreviewStrategy;
  typeLabel?: string;
};

const nerClassificationBase =
  'https://digitaalerfgoed.poolparty.biz/globalise/annotation/ner/';

const personHighlightGroup = { id: 'persons', label: 'Persons' } as const;
const organisationHighlightGroup = { id: 'organisations', label: 'Organisations' } as const;
const shipHighlightGroup = { id: 'ships', label: 'Ships' } as const;
const commodityHighlightGroup = { id: 'commodities', label: 'Commodities' } as const;
const placeHighlightGroup = { id: 'places', label: 'Places' } as const;

const entityClassificationDefinitionById = {
  'gan:PER_NAME': {
    cidocClassName: 'cidoc-actor',
    highlightLabel: 'by Name',
    highlightGroup: personHighlightGroup,
    presentationType: 'person',
    previewStrategy: 'named',
  },
  'gan:PER_ATTR': {
    cidocClassName: 'cidoc-type',
    highlightLabel: 'by Attributes',
    highlightGroup: personHighlightGroup,
    presentationType: 'person',
    previewStrategy: 'classification',
  },
  'gan:PRF': {
    cidocClassName: 'cidoc-type',
    highlightLabel: 'by Profession',
    highlightGroup: personHighlightGroup,
    presentationType: 'person',
    previewStrategy: 'classification',
  },
  'gan:STATUS': {
    cidocClassName: 'cidoc-type',
    highlightLabel: 'by Civic Status',
    highlightGroup: personHighlightGroup,
    presentationType: 'person',
    previewStrategy: 'classification',
  },
  'gan:ETH_REL': {
    cidocClassName: 'cidoc-type',
    highlightLabel: 'by Ethno-Religious Appellation',
    highlightGroup: personHighlightGroup,
    presentationType: 'person',
    previewStrategy: 'classification',
  },
  'gan:ORG': {
    cidocClassName: 'cidoc-actor',
    highlightLabel: 'by Name',
    highlightGroup: organisationHighlightGroup,
    presentationType: 'organisation',
    previewStrategy: 'classification',
  },
  'gan:SHIP': {
    cidocClassName: 'cidoc-physical-thing',
    highlightLabel: 'by Name',
    highlightGroup: shipHighlightGroup,
    presentationType: 'ship',
    previewStrategy: 'named',
  },
  'gan:SHIP_TYPE': {
    cidocClassName: 'cidoc-type',
    highlightLabel: 'by Type',
    highlightGroup: shipHighlightGroup,
    presentationType: 'ship',
    previewStrategy: 'classification',
  },
  'gan:CMTY_NAME': {
    cidocClassName: 'cidoc-physical-thing',
    highlightLabel: 'by Name',
    highlightGroup: commodityHighlightGroup,
    presentationType: 'commodity',
    previewStrategy: 'named',
  },
  'gan:CMTY_QUAL': {
    cidocClassName: 'cidoc-type',
    highlightLabel: 'by Qualifier',
    highlightGroup: commodityHighlightGroup,
    presentationType: 'commodity',
    previewStrategy: 'named',
  },
  'gan:DATE': {
    cidocClassName: 'cidoc-time-span',
    highlightLabel: 'Dates',
    presentationType: 'date',
    previewStrategy: 'named',
  },
  'gan:LOC_NAME': {
    cidocClassName: 'cidoc-place',
    highlightLabel: 'by Name',
    highlightGroup: placeHighlightGroup,
    presentationType: 'place',
    previewStrategy: 'named',
  },
  'gan:LOC_ADJ': {
    cidocClassName: 'cidoc-place',
    highlightLabel: 'by Location Form',
    highlightGroup: placeHighlightGroup,
    presentationType: 'place',
    previewStrategy: 'named',
  },
  'gan:DOC': {
    cidocClassName: 'cidoc-conceptual-object',
    highlightLabel: 'Documents',
    presentationType: 'document',
    previewStrategy: 'classification',
  },
  'gan:CMTY_QUANT': {
    cidocClassName: 'cidoc-dimension',
    highlightLabel: 'Unit',
    presentationType: 'dimensions',
    previewStrategy: 'dimension',
    typeLabel: 'Exchange Unit',
  },
} as const satisfies Record<string, EntityClassificationDefinition>;

export type CidocEntityClassificationId =
  keyof typeof entityClassificationDefinitionById;

export const cidocEntityClassificationIds = Object.keys(
  entityClassificationDefinitionById,
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
  return getEntityClassificationDefinition(classificationId).cidocClassName;
}

export function getEntityClassificationDefinition(
  classificationId: CidocEntityClassificationId,
): EntityClassificationDefinition {
  return entityClassificationDefinitionById[classificationId];
}

export function getEntityClassificationUri(
  classificationId: CidocEntityClassificationId,
): string {
  return `${nerClassificationBase}${classificationId.replace(/^gan:/, '')}`;
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
