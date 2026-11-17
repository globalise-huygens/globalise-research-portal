import type { EntityTagType } from '../entity/EntityTypes.ts';
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
  tagType: EntityTagType;
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
    highlightLabel: 'by Name',
    highlightGroup: personHighlightGroup,
    tagType: 'person',
    previewStrategy: 'named',
  },
  'ner:per_attr': {
    cidocClassName: 'cidoc-type',
    highlightLabel: 'by Attributes',
    highlightGroup: personHighlightGroup,
    tagType: 'person',
    previewStrategy: 'classification',
  },
  'ner:prf': {
    cidocClassName: 'cidoc-type',
    highlightLabel: 'by Profession',
    highlightGroup: personHighlightGroup,
    tagType: 'person',
    previewStrategy: 'classification',
  },
  'ner:status': {
    cidocClassName: 'cidoc-type',
    highlightLabel: 'by Civic Status',
    highlightGroup: personHighlightGroup,
    tagType: 'person',
    previewStrategy: 'classification',
  },
  'ner:eth_rel': {
    cidocClassName: 'cidoc-type',
    highlightLabel: 'by Ethno-Religious Appellation',
    highlightGroup: personHighlightGroup,
    tagType: 'person',
    previewStrategy: 'classification',
  },
  'ner:org': {
    cidocClassName: 'cidoc-actor',
    highlightLabel: 'by Name',
    highlightGroup: organisationHighlightGroup,
    tagType: 'organisation',
    previewStrategy: 'classification',
  },
  'ner:ship': {
    cidocClassName: 'cidoc-physical-thing',
    highlightLabel: 'by Name',
    highlightGroup: shipHighlightGroup,
    tagType: 'ship',
    previewStrategy: 'named',
  },
  'ner:ship_type': {
    cidocClassName: 'cidoc-type',
    highlightLabel: 'by Type',
    highlightGroup: shipHighlightGroup,
    tagType: 'ship',
    previewStrategy: 'classification',
  },
  'ner:cmty_name': {
    cidocClassName: 'cidoc-physical-thing',
    highlightLabel: 'by Name',
    highlightGroup: commodityHighlightGroup,
    tagType: 'commodity',
    previewStrategy: 'named',
  },
  'ner:cmty_qual': {
    cidocClassName: 'cidoc-type',
    highlightLabel: 'by Qualifier',
    highlightGroup: commodityHighlightGroup,
    tagType: 'commodity',
    previewStrategy: 'named',
  },
  'ner:date': {
    cidocClassName: 'cidoc-time-span',
    highlightLabel: 'Dates',
    tagType: 'date',
    previewStrategy: 'named',
  },
  'ner:loc_name': {
    cidocClassName: 'cidoc-place',
    highlightLabel: 'by Name',
    highlightGroup: placeHighlightGroup,
    tagType: 'place',
    previewStrategy: 'named',
  },
  'ner:loc_adj': {
    cidocClassName: 'cidoc-place',
    highlightLabel: 'by Location Form',
    highlightGroup: placeHighlightGroup,
    tagType: 'place',
    previewStrategy: 'named',
  },
  'ner:doc': {
    cidocClassName: 'cidoc-conceptual-object',
    highlightLabel: 'Documents',
    tagType: 'document',
    previewStrategy: 'classification',
  },
  'ner:cmty_quant': {
    cidocClassName: 'cidoc-dimension',
    highlightLabel: 'Unit',
    tagType: 'dimensions',
    previewStrategy: 'dimension',
    typeLabel: 'Exchange Unit',
  },
} as const satisfies Record<string, EntityClassificationDefinition>;

export type CidocEntityClassificationId =
  keyof typeof entityClassificationDefinitionById;

export const cidocEntityClassificationIds = Object.keys(
  entityClassificationDefinitionById,
) as CidocEntityClassificationId[];

/**
 * Classifications grouped by their highlight group,
 * an ungrouped classification is a group of its own.
 */
export type EntityClassificationGroup = {
  id: string;
  label: string;
  tagType: EntityTagType;
  classificationIds: CidocEntityClassificationId[];
};

export const entityClassificationGroups = createEntityClassificationGroups();

function createEntityClassificationGroups(): EntityClassificationGroup[] {
  const groups = new Map<string, EntityClassificationGroup>();
  for (const id of cidocEntityClassificationIds) {
    const definition = getEntityClassificationDefinition(id);
    const { id: groupId, label } = definition.highlightGroup ?? { id, label: definition.highlightLabel };
    const group = groups.get(groupId) ?? { id: groupId, label, tagType: definition.tagType, classificationIds: [] };
    group.classificationIds.push(id);
    groups.set(groupId, group);
  }
  return [...groups.values()];
}

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
