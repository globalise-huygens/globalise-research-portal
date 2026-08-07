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
  IconEntityConcept,
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
  const [hoveredDetail, setHoveredDetail] = useState<PreviewDetail | null>(null);
  const conceptState = useConcept();
  const [position, setPosition] = useState<CSSProperties>({ left: 0, top: 0 });
  const pointer = useRef({ x: 0, y: 0 });
  const closeTimer = useRef<number | undefined>(undefined);
  const detailHoverTimer = useRef<number | undefined>(undefined);
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
      setHoveredDetail(null);
      if (annotation && !isPreviewHovered.current) {
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
  const linkedSubject = getLinkedSubject(relationships.subject);
  const title = detail === 'concept' && concept
    ? getConceptLabel(concept)
    : detail === 'subject' && linkedSubject?._label
      ? linkedSubject._label
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
    : detail === 'subject' && linkedSubject?.id && isUrl(linkedSubject.id)
      ? linkedSubject.id
    : undefined;
  // The compact card exposes identifiers through the copy action. Full
  // external-link lists belong on the expanded object card, not this preview.
  const externalLinks: EntityPreviewCardExternalLink[] = [];
  const scheduleDetailClear = () => {
    window.clearTimeout(detailHoverTimer.current);
    detailHoverTimer.current = window.setTimeout(() => {
      setHoveredDetail(null);
    }, 120);
  };
  const keepDetail = () => window.clearTimeout(detailHoverTimer.current);
  const conceptPreview = concept && conceptUri
    ? {
        kind: 'concept' as const,
        icon: <IconEntityConcept />,
        title: getConceptLabel(concept),
        definition: preferredValue(concept.definition),
        alternativeLabels: concept.altLabel
          ?.map((label) => label['@value'])
          .filter((label, index, labels) => labels.indexOf(label) === index)
          .join(', '),
        properties: getConceptProperties(displayed, concept),
        openFullCardHref: `/object-card?concept=${encodeURIComponent(conceptUri)}`,
        copyValue: conceptUri,
        linked: true,
      }
    : null;

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
        setHoveredDetail(null);
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
            ? getConceptProperties(displayed, concept)
            : getDetailProperties(
              displayed,
              detail,
              relationships,
              linkedSubject,
              concept,
              setDetail,
              setHoveredDetail,
              keepDetail,
              scheduleDetailClear,
            ),
          externalLinks,
          openFullCardHref: href,
          copyValue: detail === 'concept'
            ? conceptUri
            : detail === 'subject'
              ? linkedSubject?.id ?? displayed.id
              : displayed.id,
          linked: detail === 'concept' || !!linkedSubject,
        }}
      />
      {hoveredDetail === 'concept' && conceptPreview && (
        <div
          className="manifest-entity-preview__related"
          onMouseEnter={keepDetail}
          onMouseLeave={scheduleDetailClear}
        >
          <EntityPreviewCard data={conceptPreview} />
        </div>
      )}
    </div>
  );
}

function useHoveredAnnotation(): EntityAnnotation | null {
  return useDocumentStore((state) => {
    // This is a hover preview, not the persistent document selection. Clicked
    // annotations remain selected/highlighted elsewhere, but must not keep a
    // floating card open after the pointer leaves the text.
    const selectedId = state.hoveredId;
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
  const title = getUnlinkedTitle(annotation);
  const properties = getUnlinkedProperties(annotation);
  return { ...category, title, properties };
}

function getUnlinkedTitle(annotation: EntityAnnotation) {
  const body = getPrimaryEntityBody(annotation);
  if (isClassificationOnly(annotation)) {
    return 'Unknown';
  }
  return body.label
    ?? body.ascribes_appellation?.content
    ?? getQuantityTitle(body)
    ?? body.classified_as._label;
}

function isClassificationOnly(annotation: EntityAnnotation) {
  const classificationId = getEntityClassificationId(annotation);
  if (classificationId === 'gan:CMTY_QUAL') {
    return false;
  }
  return classificationId === 'gan:DOC'
    || classificationId === 'gan:ORG'
    || classificationId === 'gan:PER_ATTR'
    || classificationId === 'gan:SHIP_TYPE'
    || classificationId === 'gan:PRF'
    || classificationId === 'gan:STATUS'
    || classificationId === 'gan:ETH_REL';
}

function getDetailProperties(
  annotation: EntityAnnotation,
  detail: PreviewDetail,
  relationships: ReturnType<typeof getEntityRelationships>,
  linkedSubject: ReturnType<typeof getLinkedSubject>,
  concept: SkosConcept | null,
  onDetail: (detail: PreviewDetail) => void,
  onHoverDetail: (detail: PreviewDetail) => void,
  keepDetail: () => void,
  scheduleDetailClear: () => void,
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
      onMouseEnter={() => {
        keepDetail();
        onHoverDetail(next);
      }}
      onMouseLeave={scheduleDetailClear}
    >
      {label}
    </button>
  );

  if (detail === 'subject') {
    if (!linkedSubject) {
      return getUnlinkedProperties(annotation);
    }
    const properties: (EntityPreviewCardProperty | null)[] = [
      relationships.appellation
        ? { label: 'Alt label', value: link(relationships.appellation, 'assertion') }
        : null,
      linkedSubject.type
        ? { label: 'Type', value: getLinkedSubjectTypeLabel(linkedSubject.type) }
        : null,
      conceptLabel
        ? { label: 'Classified as', value: conceptUriValue(
          concept,
          conceptLabel,
          onDetail,
          onHoverDetail,
          keepDetail,
          scheduleDetailClear,
        ) }
        : null,
      concept
        ? { label: 'Type of link', value: 'equivalent' }
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
    linkedSubject?._label
      ? { label: 'Subject', value: link(linkedSubject._label, 'subject') }
      : null,
  ];
  return properties.filter(
    (property): property is EntityPreviewCardProperty => property !== null,
  );
}

function getLinkedSubjectTypeLabel(type: string) {
  return type
    .replace(/^.*[#/]/, '')
    .replace(/([a-z])([A-Z])/g, '$1 $2');
}

function getConceptProperties(
  annotation: EntityAnnotation,
  concept: SkosConcept | null,
): EntityPreviewCardProperty[] {
  if (!concept) {
    return [];
  }
  const classification = getPrimaryEntityBody(annotation).classified_as._label;
  const scheme = concept.inScheme?.[0]
    ? getConceptLabel(concept.inScheme[0])
    : undefined;
  const broader = concept.broader?.[0]
    ? getConceptLabel(concept.broader[0])
    : undefined;
  const properties: EntityPreviewCardProperty[] = [
    { label: 'Type', value: 'Concept' },
    ...(scheme ? [{ label: 'Scheme', value: scheme }] : []),
    ...(broader ? [{ label: 'Broader', value: broader }] : []),
    { label: 'Classified by', value: classification },
  ];
  if (concept.exactMatch?.length || concept.closeMatch?.length) {
    properties.push({ label: 'Type of link', value: 'equivalent' });
  }
  return properties;
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

function getLinkedSubject(
  subject: ReturnType<typeof getEntityRelationships>['subject'],
): ReturnType<typeof getEntityRelationships>['subject'] {
  // A generated entity annotation always has a subject resource, even when no
  // authority match exists. Until the authority resolver supplies an explicit
  // linked record, treat these subjects as evidence-only and keep the card in
  // the unlinked variant. This prevents a false open-record arrow on every
  // local NER person/place/etc. annotation.
  void subject;
  return undefined;
}

function getQuantityTitle(body: EntityBody) {
  const unit = (body as EntityBody & { unit?: { _label: string } }).unit;
  if (body.classified_as.id !== 'gan:CMTY_QUANT' || body.value === undefined) {
    return undefined;
  }
  return unit?._label
    ? `${body.value} ${unit._label}`
    : String(body.value);
}

function getUnlinkedProperties(annotation: EntityAnnotation): EntityPreviewCardProperty[] {
  const body = getPrimaryEntityBody(annotation);
  const unit = (body as EntityBody & { unit?: { _label: string } }).unit;
  const classificationId = getEntityClassificationId(annotation);
  const properties: EntityPreviewCardProperty[] = [
    { label: 'Type', value: getEntityKindLabel(classificationId) },
  ];
  if (classificationId === 'gan:DATE' && body.timespan) {
    const timespan = body.timespan;
    properties.push(
      { label: 'Begin of the begin', value: timespan.begin_of_the_begin ?? '-' },
      { label: 'Begin of the end', value: timespan.begin_of_the_end ?? '-' },
      { label: 'End of the begin', value: timespan.end_of_the_begin ?? '-' },
      { label: 'End of the end', value: timespan.end_of_the_end ?? '-' },
    );
  }
  if (classificationId === 'gan:CMTY_QUANT') {
    properties.push({ label: 'Value', value: body.value ?? '-' });
    properties.push({ label: 'Unit', value: unit?._label ?? '-' });
  }
  if (isClassificationOnly(annotation)) {
    properties.push({
      label: 'Classified as',
      value: body.label ?? body.ascribes_appellation?.content ?? '—',
    });
  }
  properties.push({ label: 'Classified by', value: body.classified_as._label });
  return properties;
}

function getEntityKindLabel(classificationId: EntityClassificationId | undefined) {
  switch (classificationId) {
    case 'gan:LOC_NAME':
    case 'gan:LOC_ADJ':
      return 'Place';
    case 'gan:PER_NAME':
    case 'gan:PER_ATTR':
    case 'gan:PRF':
    case 'gan:STATUS':
      return 'Person';
    case 'gan:ORG':
      return 'Organisation';
    case 'gan:SHIP':
    case 'gan:SHIP_TYPE':
      return 'Ship';
    case 'gan:DOC':
      return 'Document';
    case 'gan:CMTY_NAME':
    case 'gan:CMTY_QUAL':
      return 'Commodity';
    case 'gan:CMTY_QUANT':
      return 'Exchange Unit';
    case 'gan:DATE':
      return 'Date';
    default:
      return 'Entity';
  }
}

function conceptUriValue(
  concept: SkosConcept | null,
  label: string,
  onDetail: (detail: PreviewDetail) => void,
  onHoverDetail: (detail: PreviewDetail) => void,
  keepDetail: () => void,
  scheduleDetailClear: () => void,
) {
  return concept
    ? <button
        type="button"
        className="manifest-entity-preview__link"
        onClick={(event) => {
          event.stopPropagation();
          onDetail('concept');
        }}
        onMouseEnter={() => {
          keepDetail();
          onHoverDetail('concept');
        }}
        onMouseLeave={scheduleDetailClear}
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
  body?: EntityBody,
) {
  const id = classificationId as string | undefined;
  switch (id) {
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
      return 'Exchange Unit';
    default:
      switch (id) {
        case 'gan:LOC_NAME':
        case 'gan:LOC_ADJ':
          return 'Place';
        case 'gan:PER_NAME':
        case 'gan:PER_ATTR':
        case 'gan:PRF':
        case 'gan:STATUS':
          return 'Person';
        case 'gan:ORG':
          return 'Organisation';
        case 'gan:SHIP':
        case 'gan:SHIP_TYPE':
          return 'Ship';
        case 'gan:DOC':
          return 'Document';
        case 'gan:CMTY_NAME':
        case 'gan:CMTY_QUAL':
          return 'Commodity';
        case 'gan:DATE':
          return 'Date';
        default:
          return body?.type === 'AppellativeStatus' ? 'Entity' : 'Entity';
      }
  }
}

function placePreview(x: number, y: number): CSSProperties {
  const gap = 12;
  const cardWidth = Math.min(360, window.innerWidth - 16);
  // Most previews are compact; only flip above the trigger when this estimate
  // would otherwise put the card beyond the bottom edge.
  const cardHeight = Math.min(190, window.innerHeight - 16);
  const left = x < window.innerWidth / 2
    ? Math.min(x + gap, window.innerWidth - cardWidth - 8)
    : Math.max(8, x - cardWidth - gap);
  // Align near the trigger instead of flipping the whole card far above it.
  // This leaves a short, predictable path from the highlighted text to the
  // card and lets the close delay act as a traversable hover bridge.
  const top = Math.min(
    Math.max(8, y - 24),
    window.innerHeight - cardHeight - 8,
  );
  return { left, top };
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
