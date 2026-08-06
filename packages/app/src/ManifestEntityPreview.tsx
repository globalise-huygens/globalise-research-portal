import { isUrl } from '@globalise/common';
import {
  getEntityBodies,
  getEntityClassificationId,
  getPrimaryEntityBody,
  isEntity,
  type Annotation,
  type EntityBody,
  type EntityClassificationId,
} from '@globalise/common/annotation';
import { useDocumentStore } from '@globalise/common/document';
import {
  EntityPreviewCard,
  IconEntityCommodity,
  IconEntityDate,
  IconEntityDimensions,
  IconEntityDocument,
  IconEntityOrganisation,
  IconEntityPerson,
  IconEntityPlace,
  IconEntityShip,
  IconEntities,
  type EntityPreviewCardKind,
  type EntityPreviewCardExternalLink,
  type EntityPreviewCardProperty,
} from '@globalise/design';
import {
  getConceptLabel,
  loadConcept,
  useConcept,
  type SkosConcept,
} from '@globalise/object-card';
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import './ManifestEntityPreview.css';

const CLOSE_DELAY = 160;
const NER_TYPE_BASE_URL =
  'https://digitaalerfgoed.poolparty.biz/globalise/annotation/ner/';

type PreviewCategory = {
  kind: EntityPreviewCardKind;
  icon: ReactNode;
};

type PreviewContent = PreviewCategory & {
  title: string;
  properties: EntityPreviewCardProperty[];
};

type EntityAnnotation = Annotation<EntityBody>;
type PreviewDetail = 'subject' | 'assertion' | 'concept';

export function ManifestEntityPreview() {
  const annotation = useHoveredAnnotation();
  const [displayed, setDisplayed] = useState<EntityAnnotation | null>(null);
  const [detail, setDetail] = useState<PreviewDetail>('subject');
  const conceptState = useConcept();
  const [position, setPosition] = useState<CSSProperties>({ left: 0, top: 0 });
  const pointer = useRef({ x: 0, y: 0 });
  const closeTimer = useRef<number | undefined>(undefined);
  const isPreviewHovered = useRef(false);
  const isPreviewVisible = useRef(false);

  useEffect(() => {
    const rememberPointer = (event: PointerEvent) => {
      pointer.current = { x: event.clientX, y: event.clientY };
    };
    window.addEventListener('pointermove', rememberPointer);
    return () => window.removeEventListener('pointermove', rememberPointer);
  }, []);

  useEffect(() => {
    window.clearTimeout(closeTimer.current);
    if (!annotation && isPreviewHovered.current) {
      return;
    }
    closeTimer.current = window.setTimeout(() => {
      setDisplayed(annotation);
      setDetail('subject');
      if (annotation && !isPreviewVisible.current) {
        setPosition(placePreview(pointer.current.x, pointer.current.y));
      }
      isPreviewVisible.current = annotation !== null;
    }, annotation ? 0 : CLOSE_DELAY);
    return () => window.clearTimeout(closeTimer.current);
  }, [annotation]);

  const conceptUri = displayed ? getConceptUri(displayed) : undefined;

  useEffect(() => {
    if (conceptUri) {
      void loadConcept(conceptUri);
    }
  }, [conceptUri]);

  if (!displayed) {
    return null;
  }

  const preview = getPreviewContent(displayed);
  const concept = conceptUri === conceptState.uri
    ? conceptState.concept
    : null;
  const relationships = getEntityRelationships(displayed);
  const title = detail === 'concept' && concept
    ? getConceptLabel(concept)
    : detail === 'subject' && relationships.subject?._label
      ? relationships.subject._label
      : detail === 'assertion' && relationships.appellation
        ? relationships.appellation
        : preview.title;
  const definition = detail === 'concept'
    ? preferredValue(concept?.definition)
    : undefined;
  const alternativeLabels = detail === 'concept' ? concept?.altLabel
    ?.map((label) => label['@value'])
    .filter((label, index, labels) => labels.indexOf(label) === index)
    .join(', ')
    : undefined;
  const href = detail === 'concept' && conceptUri
    ? `/object-card?concept=${encodeURIComponent(conceptUri)}`
    : detail === 'subject' && relationships.subject?.id && isUrl(relationships.subject.id)
      ? relationships.subject.id
    : undefined;
  const externalLinks = detail === 'assertion'
    ? getAssertionLinks(displayed)
    : detail === 'concept'
      ? getExternalLinks(displayed, concept)
      : [];

  return (
    <div
      className="manifest-entity-preview"
      style={position}
      onMouseEnter={() => {
        isPreviewHovered.current = true;
        window.clearTimeout(closeTimer.current);
      }}
      onMouseLeave={() => {
        isPreviewHovered.current = false;
        setDisplayed(annotation);
        setDetail('subject');
        isPreviewVisible.current = annotation !== null;
      }}
    >
      <EntityPreviewCard
        data={{
          kind: preview.kind,
          icon: preview.icon,
          title,
          definition,
          alternativeLabels,
          properties: detail === 'concept'
            ? []
            : getDetailProperties(
              displayed,
              detail,
              relationships,
              concept,
              setDetail,
            ),
          externalLinks,
          openFullCardHref: href,
        }}
      />
    </div>
  );
}

function useHoveredAnnotation(): EntityAnnotation | null {
  return useDocumentStore((state) => {
    const selectedId = state.hoveredId ?? state.clickedId;
    if (!selectedId) {
      return null;
    }

    for (const canvas of Object.values(state.canvases)) {
      if (!canvas.annotations) {
        continue;
      }

      const direct = canvas.annotations[selectedId];
      if (!direct) {
        continue;
      }
      if (isEntity(direct)) {
        return direct;
      }

      return findEntityForWord(
        selectedId,
        canvas.annotations,
        canvas.indexes.entityToWords,
        state.entityHighlightCategories,
      ) ?? null;
    }

    return null;
  });
}

function findEntityForWord(
  wordId: string,
  annotations: Record<string, Annotation>,
  entityToWords: Record<string, string[]>,
  visibleCategories: Set<EntityClassificationId>,
) {
  for (const [entityId, wordIds] of Object.entries(entityToWords)) {
    const annotation = annotations[entityId];
    if (!wordIds.includes(wordId) || !annotation || !isEntity(annotation)) {
      continue;
    }
    const classificationId = getEntityClassificationId(annotation);
    if (classificationId && visibleCategories.has(classificationId)) {
      return annotation;
    }
  }
}

function getConceptUri(annotation: EntityAnnotation) {
  const concept = getEntityBodies(annotation)
    .map((body) => body.ascribes_classification)
    .find((classification) => classification?.id && isUrl(classification.id));
  return concept?.id;
}

function getPreviewContent(annotation: EntityAnnotation): PreviewContent {
  const body = getPrimaryEntityBody(annotation);
  const category = getPreviewCategory(getEntityClassificationId(annotation));
  const subject = body.has_appellative_subject
    ?? body.has_classificatory_subject;
  const title = body.label
    ?? body.ascribes_appellation?.content
    ?? subject?._label
    ?? body.classified_as._label;
  const properties: EntityPreviewCardProperty[] = [
    {
      label: 'Type',
      value: getEntityTypeLabel(getEntityClassificationId(annotation)),
    },
  ];
  if (body.value !== undefined) {
    properties.push({ label: 'Value', value: body.value });
  }
  return { ...category, title, properties };
}

function getDetailProperties(
  annotation: EntityAnnotation,
  detail: PreviewDetail,
  relationships: ReturnType<typeof getEntityRelationships>,
  concept: SkosConcept | null,
  onDetail: (detail: PreviewDetail) => void,
): EntityPreviewCardProperty[] {
  const classificationLabel = relationships.classification?._label;
  const conceptLabel = concept ? getConceptLabel(concept) : classificationLabel;
  const link = (label: string, next: PreviewDetail) => (
    <button
      type="button"
      className="manifest-entity-preview__link"
      onClick={(event) => {
        event.stopPropagation();
        onDetail(next);
      }}
    >
      {label}
    </button>
  );

  if (detail === 'subject') {
    const properties: (EntityPreviewCardProperty | null)[] = [
      relationships.appellation
        ? { label: 'Alt label', value: link(relationships.appellation, 'assertion') }
        : null,
      conceptLabel
        ? { label: 'Type', value: conceptUriValue(concept, conceptLabel, onDetail) }
        : null,
      { label: 'Recognised', value: link(annotationBodyLabel(annotation), 'assertion') },
    ];
    return properties.filter(
      (property): property is EntityPreviewCardProperty => property !== null,
    );
  }

  const body = getPrimaryEntityBody(annotation);
  const properties: (EntityPreviewCardProperty | null)[] = [
    { label: 'Type', value: getEntityTypeLabel(getEntityClassificationId(annotation)) },
    { label: 'Recognised', value: body.classified_as._label },
    relationships.subject?._label
      ? { label: 'Subject', value: link(relationships.subject._label, 'subject') }
      : null,
  ];
  return properties.filter(
    (property): property is EntityPreviewCardProperty => property !== null,
  );
}

function getEntityRelationships(annotation: EntityAnnotation) {
  const body = getPrimaryEntityBody(annotation);
  return {
    subject: body.has_appellative_subject ?? body.has_classificatory_subject,
    appellation: body.ascribes_appellation?.content ?? body.label,
    classification: body.classified_as,
    classificationRelation: body.ascribes_classification,
  };
}

function conceptUriValue(
  concept: SkosConcept | null,
  label: string,
  onDetail: (detail: PreviewDetail) => void,
) {
  return concept
    ? <button
        type="button"
        className="manifest-entity-preview__link"
        onClick={(event) => {
          event.stopPropagation();
          onDetail('concept');
        }}
      >
        {label}
      </button>
    : label;
}

function annotationBodyLabel(annotation: EntityAnnotation) {
  return getPrimaryEntityBody(annotation).type === 'AppellativeStatus'
    ? 'Appellative status'
    : 'Classificatory status';
}

function getAssertionLinks(
  annotation: EntityAnnotation,
): EntityPreviewCardExternalLink[] {
  const body = getPrimaryEntityBody(annotation);
  const classificationUri = body.classified_as.id.startsWith('gan:')
    ? `${NER_TYPE_BASE_URL}${body.classified_as.id.slice(4)}`
    : body.classified_as.id;
  return [
    { href: annotation.id, label: 'data.globalise' },
    { href: classificationUri, label: 'poolparty' },
  ].filter((link) => isUrl(link.href));
}

function preferredValue(
  values: { '@language': string; '@value': string }[] | undefined,
) {
  return values?.find((value) => value['@language'] === 'en')?.['@value']
    ?? values?.find((value) => value['@language'] === 'nl')?.['@value']
    ?? values?.[0]?.['@value'];
}

function getEntityTypeLabel(
  classificationId: EntityClassificationId | undefined,
) {
  switch (classificationId) {
    case 'gan:PER_NAME':
      return 'Person name';
    case 'gan:PER_ATTR':
      return 'Person attribute';
    case 'gan:PRF':
      return 'Profession';
    case 'gan:STATUS':
      return 'Civic status';
    case 'gan:ETH_REL':
      return 'Ethno-religious appellation';
    case 'gan:ORG':
      return 'Organisation name';
    case 'gan:SHIP':
      return 'Ship name';
    case 'gan:SHIP_TYPE':
      return 'Ship type';
    case 'gan:CMTY_NAME':
      return 'Commodity name';
    case 'gan:CMTY_QUAL':
      return 'Commodity qualifier';
    case 'gan:DATE':
      return 'Date';
    case 'gan:LOC_NAME':
      return 'Place name';
    case 'gan:LOC_ADJ':
      return 'Location form';
    case 'gan:DOC':
      return 'Document';
    case 'gan:CMTY_QUANT':
      return 'Quantity';
    default:
      return 'Entity';
  }
}

function placePreview(x: number, y: number): CSSProperties {
  const gap = 12;
  const horizontal = x < window.innerWidth / 2
    ? { left: x + gap }
    : { right: window.innerWidth - x + gap };
  const vertical = y < window.innerHeight / 2
    ? { top: y + gap }
    : { bottom: window.innerHeight - y + gap };
  return { ...horizontal, ...vertical };
}

function getExternalLinks(
  annotation: EntityAnnotation,
  concept: SkosConcept | null,
): EntityPreviewCardExternalLink[] {
  const body = getPrimaryEntityBody(annotation);
  const subject = body.has_appellative_subject
    ?? body.has_classificatory_subject;
  const classificationUri = body.classified_as.id.startsWith('gan:')
    ? `${NER_TYPE_BASE_URL}${body.classified_as.id.slice(4)}`
    : body.classified_as.id;
  const conceptMatches = [
    ...(concept?.closeMatch ?? []),
    ...(concept?.narrowMatch ?? []),
    ...(concept?.exactMatch ?? []),
  ].map((match) => typeof match === 'string' ? match : match.id);
  const candidates = [
    ...conceptMatches,
    annotation.id,
    subject?.id,
    classificationUri,
  ];

  return candidates
    .filter((href): href is string => typeof href === 'string' && isUrl(href))
    .filter((href, index, links) =>
      links.findIndex((link) => getExternalLinkKey(link) === getExternalLinkKey(href))
      === index,
    )
    .map((href) => ({ href, label: getExternalLinkLabel(href) }));
}

function getExternalLinkKey(href: string) {
  const url = new URL(href);
  url.hash = '';
  return url.href;
}

function getExternalLinkLabel(href: string) {
  return new URL(href).hostname.replace(/^www\./, '');
}

function getPreviewCategory(
  classificationId: EntityClassificationId | undefined,
): PreviewCategory {
  switch (classificationId) {
    case 'gan:PER_NAME':
    case 'gan:PER_ATTR':
    case 'gan:PRF':
    case 'gan:STATUS':
    case 'gan:ETH_REL':
      return { kind: 'person', icon: <IconEntityPerson /> };
    case 'gan:ORG':
      return { kind: 'organisation', icon: <IconEntityOrganisation /> };
    case 'gan:SHIP':
    case 'gan:SHIP_TYPE':
      return { kind: 'ship', icon: <IconEntityShip /> };
    case 'gan:CMTY_NAME':
    case 'gan:CMTY_QUAL':
      return { kind: 'commodity', icon: <IconEntityCommodity /> };
    case 'gan:DATE':
      return { kind: 'date', icon: <IconEntityDate /> };
    case 'gan:LOC_NAME':
    case 'gan:LOC_ADJ':
      return { kind: 'place', icon: <IconEntityPlace /> };
    case 'gan:DOC':
      return { kind: 'document', icon: <IconEntityDocument /> };
    case 'gan:CMTY_QUANT':
      return { kind: 'dimensions', icon: <IconEntityDimensions /> };
    default:
      return { kind: 'entity', icon: <IconEntities /> };
  }
}
