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
import {
  setHovered,
  useDocumentStore,
  type DocumentState,
  type HoverAnchor,
} from '@globalise/common/document';
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
  useLayoutEffect,
  useCallback,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import './ManifestEntityPreview.css';

// Hoverable supplemental content must remain available while the pointer or
// keyboard focus moves from its trigger into the content (WCAG 1.4.13).
const CLOSE_DELAY = 700;
const DETAIL_CLOSE_DELAY = 500;

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
  const [displayed, setDisplayed] = useState<EntityAnnotation | null>(() =>
    getHoveredAnnotation(useDocumentStore.getState()),
  );
  const [detail, setDetail] = useState<PreviewDetail>('subject');
  const [hoveredDetail, setHoveredDetail] = useState<PreviewDetail | null>(null);
  const conceptState = useConcept();
  const [anchor, setAnchor] = useState<HoverAnchor | null>(() => {
    const state = useDocumentStore.getState();
    const initialAnnotation = getHoveredAnnotation(state);
    return initialAnnotation ? state.hoveredAt : null;
  });
  const [position, setPosition] = useState<CSSProperties>({
    left: 0,
    top: 0,
    visibility: 'hidden',
  });
  const [relatedPosition, setRelatedPosition] = useState<CSSProperties>({
    left: 0,
    top: 0,
  });
  const previewRef = useRef<HTMLDivElement>(null);
  const relatedPreviewRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const closeTimer = useRef<number | undefined>(undefined);
  const isPreviewHovered = useRef(false);
  const displayedId = useRef<string | null>(displayed?.id ?? null);
  const { keepDetail, scheduleDetailClear } = useDetailCloseControls(
    setHoveredDetail,
  );

  useEffect(() => {
    const rememberPointer = (event: PointerEvent) => {
      pointer.current = { x: event.clientX, y: event.clientY };
    };
    window.addEventListener('pointermove', rememberPointer);
    return () => window.removeEventListener('pointermove', rememberPointer);
  }, []);

  useEffect(() => useDocumentStore.subscribe((state) => {
    const annotation = getHoveredAnnotation(state);
    if (annotation) {
      window.clearTimeout(closeTimer.current);
      const changedAnnotation = displayedId.current !== annotation.id;
      displayedId.current = annotation.id;
      setDisplayed(annotation);
      if (changedAnnotation) {
        setDetail('subject');
        setHoveredDetail(null);
      }
      setAnchor(state.hoveredAt ?? pointerAnchor(pointer.current));
      return;
    }

    if (isPreviewHovered.current) {
      return;
    }

    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      // A pointer or keyboard transition into the card wins over the delayed
      // leave event emitted by the transcription/facsimile annotation.
      if (
        isPreviewHovered.current ||
        useDocumentStore.getState().hoveredId !== null
      ) {
        return;
      }
      displayedId.current = null;
      setDisplayed(null);
      setAnchor(null);
      setDetail('subject');
      setHoveredDetail(null);
    }, CLOSE_DELAY);
  }), []);

  useEffect(() => () => {
    window.clearTimeout(closeTimer.current);
  }, []);

  useLayoutEffect(() => {
    const preview = previewRef.current;
    if (!displayed || !anchor || !preview) {
      return;
    }

    const updatePosition = () => {
      const rect = preview.getBoundingClientRect();
      const relatedRect = relatedPreviewRef.current?.getBoundingClientRect();
      const anchorRect = anchor.element?.getBoundingClientRect();
      const currentAnchor = anchorRect
        ? {
          ...anchor,
          left: anchorRect.left,
          top: anchorRect.top,
          right: anchorRect.right,
          bottom: anchorRect.bottom,
          width: anchorRect.width,
          height: anchorRect.height,
        }
        : anchor;
      // The source card is positioned independently and must not jump when a
      // related card is added to the stack.
      const mainPosition = placePreview(currentAnchor, rect.width, rect.height);
      setPosition(mainPosition);

      if (!relatedRect) {
        setRelatedPosition({ left: 0, top: 0 });
        return;
      }

      const margin = 8;
      const mainLeft = typeof mainPosition.left === 'number'
        ? mainPosition.left
        : 0;
      const mainTop = typeof mainPosition.top === 'number'
        ? mainPosition.top
        : 0;
      const minimumLeft = margin - mainLeft;
      const maximumLeft = Math.max(
        minimumLeft,
        window.innerWidth - margin - relatedRect.width - mainLeft,
      );
      const minimumTop = margin - mainTop;
      const maximumTop = Math.max(
        minimumTop,
        window.innerHeight - margin - relatedRect.height - mainTop,
      );
      setRelatedPosition({
        left: clamp(32, minimumLeft, maximumLeft),
        top: clamp(
          Math.min(rect.height * 0.75, 128),
          minimumTop,
          maximumTop,
        ),
      });
    };

    updatePosition();
    const resizeObserver = new ResizeObserver(updatePosition);
    resizeObserver.observe(preview);
    if (relatedPreviewRef.current) {
      resizeObserver.observe(relatedPreviewRef.current);
    }
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [anchor, displayed, detail, hoveredDetail]);

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

  return createPortal(
    <div
      ref={previewRef}
      className="manifest-entity-preview"
      style={position}
      onPointerEnter={() => {
        isPreviewHovered.current = true;
        window.clearTimeout(closeTimer.current);
        keepDetail();
        // Keep both the preview and its source highlight active while the user
        // crosses into or interacts with the card.
        setHovered(displayed.id, anchor ?? undefined);
      }}
      onPointerLeave={() => {
        isPreviewHovered.current = false;
        setHovered(null);
        window.clearTimeout(closeTimer.current);
        closeTimer.current = window.setTimeout(() => {
          if (
            isPreviewHovered.current ||
            useDocumentStore.getState().hoveredId !== null
          ) {
            return;
          }
          displayedId.current = null;
          setDisplayed(null);
          setAnchor(null);
          setDetail('subject');
          setHoveredDetail(null);
        }, CLOSE_DELAY);
        scheduleDetailClear();
      }}
      onFocusCapture={() => {
        isPreviewHovered.current = true;
        window.clearTimeout(closeTimer.current);
        keepDetail();
        setHovered(displayed.id, anchor ?? undefined);
      }}
      onBlurCapture={(event) => {
        if (
          event.relatedTarget instanceof Node &&
          event.currentTarget.contains(event.relatedTarget)
        ) {
          return;
        }
        isPreviewHovered.current = false;
        setHovered(null);
        scheduleDetailClear();
        window.clearTimeout(closeTimer.current);
        closeTimer.current = window.setTimeout(() => {
          if (
            isPreviewHovered.current ||
            useDocumentStore.getState().hoveredId !== null
          ) {
            return;
          }
          displayedId.current = null;
          setDisplayed(null);
          setAnchor(null);
          setDetail('subject');
          setHoveredDetail(null);
        }, CLOSE_DELAY);
      }}
      onKeyDown={(event) => {
        if (event.key !== 'Escape') {
          return;
        }
        event.stopPropagation();
        window.clearTimeout(closeTimer.current);
        keepDetail();
        isPreviewHovered.current = false;
        setHovered(null);
        setDisplayed(null);
        setHoveredDetail(null);
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
          ref={relatedPreviewRef}
          className="manifest-entity-preview__related"
          style={relatedPosition}
          onPointerEnter={() => {
            isPreviewHovered.current = true;
            window.clearTimeout(closeTimer.current);
            keepDetail();
          }}
          onPointerLeave={scheduleDetailClear}
        >
          <EntityPreviewCard data={conceptPreview} />
        </div>
      )}
    </div>,
    document.body,
  );
}

function useDetailCloseControls(
  onClear: (detail: PreviewDetail | null) => void,
) {
  const timer = useRef<number | undefined>(undefined);
  const keepDetail = useCallback(() => {
    window.clearTimeout(timer.current);
  }, []);
  const scheduleDetailClear = useCallback(() => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      onClear(null);
    }, DETAIL_CLOSE_DELAY);
  }, [onClear]);

  useEffect(() => () => {
    window.clearTimeout(timer.current);
  }, []);

  return { keepDetail, scheduleDetailClear };
}

function pointerAnchor(pointer: { x: number; y: number }): HoverAnchor {
  return {
    x: pointer.x,
    y: pointer.y,
    left: pointer.x,
    top: pointer.y,
    right: pointer.x,
    bottom: pointer.y,
    width: 0,
    height: 0,
  };
}

function getHoveredAnnotation(state: DocumentState): EntityAnnotation | null {
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
      onPointerEnter={() => {
        keepDetail();
        onHoverDetail(next);
      }}
      onPointerLeave={scheduleDetailClear}
    >
      {label}
    </button>
  );

  if (detail === 'subject') {
    if (!linkedSubject) {
      const properties = getUnlinkedProperties(annotation);
      if (!concept || !conceptLabel) {
        return properties;
      }
      return [
        properties[0],
        {
          label: 'Classified as',
          value: conceptUriValue(
            concept,
            conceptLabel,
            onDetail,
            onHoverDetail,
            keepDetail,
            scheduleDetailClear,
          ),
        },
        { label: 'Type of link', value: 'equivalent' },
        ...properties.slice(1),
      ];
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
      onPointerEnter={() => {
        keepDetail();
        onHoverDetail('concept');
      }}
      onPointerLeave={scheduleDetailClear}
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

function placePreview(
  anchor: HoverAnchor,
  cardWidth: number,
  cardHeight: number,
): CSSProperties {
  const margin = 8;
  const gap = 8;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const maxLeft = Math.max(margin, viewportWidth - cardWidth - margin);
  const maxTop = Math.max(margin, viewportHeight - cardHeight - margin);
  const left = clamp(anchor.left, margin, maxLeft);
  const belowTop = anchor.bottom + gap;
  const aboveTop = anchor.top - cardHeight - gap;
  const spaceBelow = viewportHeight - margin - belowTop;
  const spaceAbove = anchor.top - gap - margin;
  const preferredTop = cardHeight <= spaceBelow
    ? belowTop
    : cardHeight <= spaceAbove
      ? aboveTop
      : spaceBelow >= spaceAbove
        ? belowTop
        : aboveTop;
  const top = clamp(preferredTop, margin, maxTop);

  return { left, top, visibility: 'visible' };
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum);
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
