import {
  getCidocEntityClassificationId,
  getEntityClassificationDefinition,
  getPrimaryEntityBody,
  isEntity,
  type Annotation,
  type EntityBody,
  type CidocEntityClassificationId,
  type EntityPreviewStrategy,
} from '@globalise/common/annotation';
import { RelationLink } from '@globalise/object-card';
import {
  getHoverDelay,
  getHoverElement,
  removeHoverAttribute,
  setHovered,
  useDocumentStore,
  type DocumentState,
  type Selection,
} from '@globalise/common/document';
import {
  EntityPreview,
  EntityIcon,
  getEntityTypeLabel,
  type EntityPreviewCardData,
  type EntityPreviewCardType,
  type EntityPreviewCardProperty,
} from '@globalise/design';
import { useEffect, useState } from 'react';
import { getInternalConceptUri, getLinkedObjectCardHref } from './ManifestEntityPreviewModel';
import './ManifestEntityPreview.css';

type EntityAnnotation = Annotation<EntityBody>;
type LinkedConceptReference = {
  uri: string;
  fallbackLabel: string;
};
type LinkedClassificationReference = {
  identifier: string;
  label: string;
};

export function ManifestEntityPreview() {
  const [preview, setPreview] = useState<{
    annotation: EntityAnnotation;
    anchor: Element;
    isHovered: boolean;
  } | null>(null);

  useEffect(() => {
    const update = (state: DocumentState) => {
      const anchor = state.hovered ? getHoverElement() : null;
      const annotation = getHoveredAnnotation(state, state.hovered);
      setPreview((current) => annotation && anchor
        ? current?.annotation === annotation && current.anchor === anchor && current.isHovered
          ? current : { annotation, anchor, isHovered: true }
        : current?.isHovered ? { ...current, isHovered: false } : current);
    };
    update(useDocumentStore.getState());
    return useDocumentStore.subscribe((state, previous) => {
      if (state.hovered !== previous.hovered || state.canvases !== previous.canvases
        || state.entityHighlightCategories !== previous.entityHighlightCategories) {
        update(state);
      }
    });
  }, []);

  if (!preview) {return null;}
  return <EntityPreview
    key={preview.annotation.id}
    data={getPreviewData(preview.annotation)}
    anchor={preview.anchor}
    isHovered={preview.isHovered}
    openImmediately={getHoverDelay(preview.anchor) === 'immediate'}
    onOpenChange={(open) => {
      if (open) {
        if (useDocumentStore.getState().hovered?.id !== preview.annotation.id) {
          setHovered(preview.annotation.id);
        }
      } else {
        removeHoverAttribute(preview.anchor);
        setPreview(null);
        setHovered(null);
      }
    }}
  />;
}
function getHoveredAnnotation(
  state: DocumentState,
  hovered: Selection | null,
): EntityAnnotation | null {
  if (!hovered || hovered.type === 'block') {
    return null;
  }

  for (const { annotations, indexes } of Object.values(state.canvases)) {
    const annotation = annotations?.[hovered.id];
    if (!annotations || !annotation) {
      continue;
    }
    if (isEntity(annotation)) {
      return annotation;
    }

    return findEntityForWord(
      hovered.id,
      annotations,
      indexes.entityToWords,
      state.entityHighlightCategories,
    ) ?? null;
  }

  return null;
}

function findEntityForWord(
  wordId: string,
  annotations: Record<string, Annotation>,
  entityToWords: Record<string, string[]>,
  visibleCategories: Set<CidocEntityClassificationId>,
) {
  for (const [entityId, wordIds] of Object.entries(entityToWords)) {
    const annotation = annotations[entityId];
    if (!wordIds.includes(wordId) || !annotation || !isEntity(annotation)) {
      continue;
    }
    const classificationId = getCidocEntityClassificationId(annotation);
    if (classificationId && visibleCategories.has(classificationId)) {
      return annotation;
    }
  }
}

function getPreviewData(annotation: EntityAnnotation): EntityPreviewCardData {
  const body = getPrimaryEntityBody(annotation);
  const classificationId = getCidocEntityClassificationId(annotation);
  const definition = getPreviewDefinition(classificationId);
  const classification = classificationId ? getClassificationReference(body, classificationId) : undefined;
  return {
    type: definition.type,
    icon: <EntityIcon type={definition.type} />,
    openFullCardHref: getLinkedObjectCardHref(body),
    title: definition.getTitle(body),
    properties: [
      { label: 'Entity type', value: definition.typeLabel ?? getEntityTypeLabel(definition.type) },
      ...(definition.getProperties?.({ body, conceptReference: getClassificationConceptReference(body) }) ?? []),
      {
        label: 'Classified by',
        value: classification ? (
          <EntityPreview data={getClassificationPreviewData(classification)}>
            {(attributes) => <button {...attributes} type="button" className="manifest-entity-preview__linked-value">
              <span>{classification.label}</span>
              <EntityIcon type="classification" />
            </button>}
          </EntityPreview>
        ) : body.classified_as._label,
      },
    ],
  };
}

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
    ?? (body.value === undefined
      ? body.classified_as._label
      : body.unit?._label
        ? `${body.value} ${body.unit._label}`
        : String(body.value)),
  getProperties: ({ body }) => [
    { label: 'Value', value: body.value ?? '-' },
    { label: 'Unit', value: body.unit?._label ?? '-' },
  ],
};

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
