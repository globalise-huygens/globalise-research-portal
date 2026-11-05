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
  label: string;
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
  'https://data.globalise.huygens.knaw.nl/hdl:20.500.14722/thesaurus:';

const personHighlightGroup = { id: 'persons', label: 'Persons' } as const;
const organisationHighlightGroup = { id: 'organisations', label: 'Organisations' } as const;
const shipHighlightGroup = { id: 'ships', label: 'Ships' } as const;
const commodityHighlightGroup = { id: 'commodities', label: 'Commodities' } as const;
const placeHighlightGroup = { id: 'places', label: 'Places' } as const;

const entityClassificationDefinitionById = {
  'ner:per_name': {
    cidocClassName: 'cidoc-actor',
    label: 'Name of Person',
    highlightLabel: 'by Name',
    highlightGroup: personHighlightGroup,
    presentationType: 'person',
    previewStrategy: 'named',
  },
  'ner:per_attr': {
    cidocClassName: 'cidoc-type',
    label: 'Person Attribute',
    highlightLabel: 'by Attributes',
    highlightGroup: personHighlightGroup,
    presentationType: 'person',
    previewStrategy: 'classification',
  },
  'ner:prf': {
    cidocClassName: 'cidoc-type',
    label: 'Profession',
    highlightLabel: 'by Profession',
    highlightGroup: personHighlightGroup,
    presentationType: 'person',
    previewStrategy: 'classification',
  },
  'ner:status': {
    cidocClassName: 'cidoc-type',
    label: 'Status',
    highlightLabel: 'by Civic Status',
    highlightGroup: personHighlightGroup,
    presentationType: 'person',
    previewStrategy: 'classification',
  },
  'ner:eth_rel': {
    cidocClassName: 'cidoc-type',
    label: 'Ethno-Religious Appellation',
    highlightLabel: 'by Ethno-Religious Appellation',
    highlightGroup: personHighlightGroup,
    presentationType: 'person',
    previewStrategy: 'classification',
  },
  'ner:org': {
    cidocClassName: 'cidoc-actor',
    label: 'Name of Organisation',
    highlightLabel: 'by Name',
    highlightGroup: organisationHighlightGroup,
    presentationType: 'organisation',
    previewStrategy: 'classification',
  },
  'ner:ship': {
    cidocClassName: 'cidoc-physical-thing',
    label: 'Name of Ship',
    highlightLabel: 'by Name',
    highlightGroup: shipHighlightGroup,
    presentationType: 'ship',
    previewStrategy: 'named',
  },
  'ner:ship_type': {
    cidocClassName: 'cidoc-type',
    label: 'Ship Type',
    highlightLabel: 'by Type',
    highlightGroup: shipHighlightGroup,
    presentationType: 'ship',
    previewStrategy: 'classification',
  },
  'ner:cmty_name': {
    cidocClassName: 'cidoc-physical-thing',
    label: 'Name of Commodity',
    highlightLabel: 'by Name',
    highlightGroup: commodityHighlightGroup,
    presentationType: 'commodity',
    previewStrategy: 'named',
  },
  'ner:cmty_qual': {
    cidocClassName: 'cidoc-type',
    label: 'Commodity Qualifier',
    highlightLabel: 'by Qualifier',
    highlightGroup: commodityHighlightGroup,
    presentationType: 'commodity',
    previewStrategy: 'named',
  },
  'ner:date': {
    cidocClassName: 'cidoc-time-span',
    label: 'Date',
    highlightLabel: 'Dates',
    presentationType: 'date',
    previewStrategy: 'named',
  },
  'ner:loc_name': {
    cidocClassName: 'cidoc-place',
    label: 'Name of Place',
    highlightLabel: 'by Name',
    highlightGroup: placeHighlightGroup,
    presentationType: 'place',
    previewStrategy: 'named',
  },
  'ner:loc_adj': {
    cidocClassName: 'cidoc-place',
    label: 'Location Form',
    highlightLabel: 'by Location Form',
    highlightGroup: placeHighlightGroup,
    presentationType: 'place',
    previewStrategy: 'named',
  },
  'ner:doc': {
    cidocClassName: 'cidoc-conceptual-object',
    label: 'Document',
    highlightLabel: 'Documents',
    presentationType: 'document',
    previewStrategy: 'classification',
  },
  'ner:cmty_quant': {
    cidocClassName: 'cidoc-dimension',
    label: 'Quantity',
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
  return `${nerClassificationBase}${classificationId.replace(/^ner:/, '')}`;
}

export function getCidocEntityClassificationId(
  annotation: Annotation,
): CidocEntityClassificationId | undefined {
  const id = getPrimaryEntityBody(annotation).classified_as.id;
  return isCidocEntityClassificationId(id) ? id : undefined;
}

export function getCidocEntityClassifiedAsLabel(entity: Annotation) {
  const body = getPrimaryEntityBody(entity);
  const classificationId = getCidocEntityClassificationId(entity);
  return classificationId
    ? getEntityClassificationDefinition(classificationId).label
    : body.classified_as.id;
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
