import {
  getCidocEntityClassificationId,
  getEntityClassificationDefinition,
  getPrimaryEntityBody,
  type Annotation,
  type CidocEntityClassificationId,
  type EntityBody,
  type EntityPreviewStrategy,
} from '@globalise/common/annotation';
import { RelationLink } from '@globalise/object-card';
import {
  EntityIcon,
  EntityPreview,
  getEntityTypeLabel,
  type EntityPreviewCardData,
  type EntityPreviewCardProperty,
  type EntityPreviewCardType,
} from '@globalise/design';
import type { ReactNode } from 'react';
import { getInternalConceptUri, getLinkedObjectCardHref } from './ManifestEntityPreviewModel';

export function getEntityPreviewData(annotation: Annotation<EntityBody>): EntityPreviewCardData {
  const body = getPrimaryEntityBody(annotation);
  const classificationId = getCidocEntityClassificationId(annotation);
  const definition = getPreviewDefinition(classificationId);
  const conceptReference = getClassificationConceptReference(body);
  const typeLabel = definition.typeLabel ?? getEntityTypeLabel(definition.type);
  const strategyProperties = definition.getProperties?.({ body, conceptReference }) ?? [];

  return {
    type: definition.type,
    icon: <EntityIcon type={definition.type} />,
    openFullCardHref: getLinkedObjectCardHref(body),
    title: definition.getTitle(body),
    properties: [
      { label: 'Entity type', value: typeLabel },
      ...strategyProperties,
      { label: 'Classified by', value: getClassifiedBy(body, classificationId) },
    ],
  };
}

function getClassifiedBy(
  body: EntityBody,
  classificationId: CidocEntityClassificationId | undefined,
): ReactNode {
  if (!classificationId) {
    return body.classified_as._label;
  }

  const classification = getClassificationReference(body, classificationId);
  return (
    <EntityPreview data={getClassificationPreviewData(classification)}>
      {(attributes) => (
        <button {...attributes} type="button" className="manifest-preview-link">
          <span>{classification.label}</span>
          <EntityIcon type="classification" />
        </button>
      )}
    </EntityPreview>
  );
}

type LinkedClassificationReference = {
  identifier: string;
  label: string;
};

function getClassificationPreviewData(
  reference: LinkedClassificationReference,
): EntityPreviewCardData {
  return {
    type: 'classification',
    icon: <EntityIcon type="classification" />,
    title: reference.label,
    properties: [
      { label: 'Type', value: 'NER classification' },
      { label: 'Identifier', value: reference.identifier },
    ],
  };
}

type LinkedConceptReference = {
  uri: string;
  fallbackLabel: string;
};

function getClassificationConceptReference(
  body: EntityBody,
): LinkedConceptReference | undefined {
  const classification = body.ascribes_classification;
  if (!classification?.id || classification.type !== 'Concept') {
    return undefined;
  }
  const uri = getInternalConceptUri(classification.id);
  if (!uri) {
    return undefined;
  }
  return {
    uri,
    fallbackLabel: classification._label ?? body.label ?? 'Concept',
  };
}

function getClassificationReference(
  body: EntityBody,
  classificationId: CidocEntityClassificationId,
): LinkedClassificationReference {
  return {
    identifier: classificationId.replace(/^ner:/, ''),
    label: body.classified_as._label,
  };
}

function getNamedPreviewTitle(body: EntityBody) {
  return body.label
    ?? body.ascribes_appellation?.content
    ?? body.classified_as._label;
}

type EntityPreviewDefinition = {
  type: EntityPreviewCardType;
  typeLabel?: string;
  getTitle: (body: EntityBody) => string;
  getProperties?: (context: EntityPreviewContext) => EntityPreviewCardProperty[];
};

type EntityPreviewContext = {
  body: EntityBody;
  conceptReference?: LinkedConceptReference;
};

type EntityPreviewBehavior = Pick<
  EntityPreviewDefinition,
  'getTitle' | 'getProperties'
>;

const namedPreview: EntityPreviewBehavior = {
  getTitle: getNamedPreviewTitle,
};

const classificationPreview: EntityPreviewBehavior = {
  getTitle: () => 'Unknown',
  getProperties: ({ body, conceptReference }) => [{
    label: 'Classified as',
    value: conceptReference ? (
      <RelationLink node={{ id: conceptReference.uri, type: 'Concept', prefLabel: conceptReference.fallbackLabel }} />
    ) : body.label ?? body.ascribes_appellation?.content ?? '—',
  }],
};

const dimensionPreview: EntityPreviewBehavior = {
  getTitle: (body) => body.label
    ?? body.ascribes_appellation?.content
    ?? getDimensionValueTitle(body),
  getProperties: ({ body }) => [
    { label: 'Value', value: body.value ?? '-' },
    { label: 'Unit', value: body.unit?._label ?? '-' },
  ],
};

function getDimensionValueTitle(body: EntityBody): string {
  if (body.value === undefined) {
    return body.classified_as._label;
  }
  const unit = body.unit?._label;
  return unit ? `${body.value} ${unit}` : String(body.value);
}

const previewBehaviorByStrategy = {
  named: namedPreview,
  classification: classificationPreview,
  dimension: dimensionPreview,
} satisfies Record<EntityPreviewStrategy, EntityPreviewBehavior>;

const fallbackPreviewDefinition: EntityPreviewDefinition = {
  type: 'entity',
  ...namedPreview,
};

function getPreviewDefinition(
  classificationId: CidocEntityClassificationId | undefined,
): EntityPreviewDefinition {
  if (!classificationId) {
    return fallbackPreviewDefinition;
  }

  const definition = getEntityClassificationDefinition(classificationId);
  return {
    type: definition.presentationType,
    typeLabel: definition.typeLabel,
    ...previewBehaviorByStrategy[definition.previewStrategy],
  };
}
