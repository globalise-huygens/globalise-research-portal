import {
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
  IconEntityDate,
  IconEntityDimensions,
  IconEntityDocument,
  IconEntityOrganisation,
  IconEntityPerson,
  IconEntityPlace,
  IconEntityShip,
  IconEntities,
  type EntityPreviewCardData,
  type EntityPreviewCardKind,
  type EntityPreviewCardProperty,
} from '@globalise/design';
import {
  useEffect,
  useLayoutEffect,
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

type EntityAnnotation = Annotation<EntityBody>;
type PreviewCategory = {
  kind: EntityPreviewCardKind;
  icon: ReactNode;
};

export function ManifestEntityPreview() {
  const initialState = useDocumentStore.getState();
  const initialAnnotation = getHoveredAnnotation(initialState);
  const [displayed, setDisplayed] = useState<EntityAnnotation | null>(
    initialAnnotation,
  );
  const [anchor, setAnchor] = useState<HoverAnchor | null>(
    initialAnnotation ? initialState.hoveredAt : null,
  );
  const [position, setPosition] = useState<CSSProperties>({
    left: 0,
    top: 0,
    visibility: 'hidden',
  });
  const previewRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const closeTimer = useRef<number | undefined>(undefined);
  const isPreviewHovered = useRef(false);

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
      setDisplayed(annotation);
      setAnchor(state.hoveredAt ?? pointerAnchor(pointer.current));
      return;
    }

    if (isPreviewHovered.current) {
      return;
    }

    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      if (
        isPreviewHovered.current ||
        useDocumentStore.getState().hoveredId !== null
      ) {
        return;
      }
      setDisplayed(null);
      setAnchor(null);
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
      setPosition(placePreview(currentAnchor, rect.width, rect.height));
    };

    updatePosition();
    const resizeObserver = new ResizeObserver(updatePosition);
    resizeObserver.observe(preview);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [anchor, displayed]);

  if (!displayed) {
    return null;
  }

  function close() {
    setDisplayed(null);
    setAnchor(null);
  }

  function scheduleClose() {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      if (
        isPreviewHovered.current ||
        useDocumentStore.getState().hoveredId !== null
      ) {
        return;
      }
      close();
    }, CLOSE_DELAY);
  }

  return createPortal(
    <div
      ref={previewRef}
      className="manifest-entity-preview"
      style={position}
      onPointerEnter={() => {
        isPreviewHovered.current = true;
        window.clearTimeout(closeTimer.current);
        setHovered(displayed.id, anchor ?? undefined);
      }}
      onPointerLeave={() => {
        isPreviewHovered.current = false;
        setHovered(null);
        scheduleClose();
      }}
      onFocusCapture={() => {
        isPreviewHovered.current = true;
        window.clearTimeout(closeTimer.current);
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
        scheduleClose();
      }}
      onKeyDown={(event) => {
        if (event.key !== 'Escape') {
          return;
        }
        event.stopPropagation();
        window.clearTimeout(closeTimer.current);
        isPreviewHovered.current = false;
        setHovered(null);
        close();
      }}
    >
      <EntityPreviewCard data={getPreviewData(displayed)} />
    </div>,
    document.body,
  );
}

function getHoveredAnnotation(state: DocumentState): EntityAnnotation | null {
  const hoveredId = state.hoveredId;
  if (!hoveredId) {
    return null;
  }

  for (const canvas of Object.values(state.canvases)) {
    if (!canvas.annotations) {
      continue;
    }

    const direct = canvas.annotations[hoveredId];
    if (!direct) {
      continue;
    }
    if (isEntity(direct)) {
      return direct;
    }

    return findEntityForWord(
      hoveredId,
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

function getPreviewData(annotation: EntityAnnotation): EntityPreviewCardData {
  return {
    ...getPreviewCategory(getEntityClassificationId(annotation)),
    title: getPreviewTitle(annotation),
    properties: getPreviewProperties(annotation),
    copyValue: annotation.id,
  };
}

function getPreviewTitle(annotation: EntityAnnotation) {
  const body = getPrimaryEntityBody(annotation);
  if (isClassificationOnly(annotation)) {
    return 'Unknown';
  }
  return body.label
    ?? body.ascribes_appellation?.content
    ?? getQuantityTitle(body)
    ?? body.classified_as._label;
}

function getPreviewProperties(
  annotation: EntityAnnotation,
): EntityPreviewCardProperty[] {
  const body = getPrimaryEntityBody(annotation);
  const classificationId = getEntityClassificationId(annotation);
  const properties: EntityPreviewCardProperty[] = [
    { label: 'Type', value: getEntityKindLabel(classificationId) },
  ];

  if (classificationId === 'gan:DATE' && body.timespan) {
    properties.push(
      { label: 'Begin of the begin', value: body.timespan.begin_of_the_begin ?? '-' },
      { label: 'Begin of the end', value: body.timespan.begin_of_the_end ?? '-' },
      { label: 'End of the begin', value: body.timespan.end_of_the_begin ?? '-' },
      { label: 'End of the end', value: body.timespan.end_of_the_end ?? '-' },
    );
  }
  if (classificationId === 'gan:CMTY_QUANT') {
    properties.push(
      { label: 'Value', value: body.value ?? '-' },
      { label: 'Unit', value: body.unit?._label ?? '-' },
    );
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

function getQuantityTitle(body: EntityBody) {
  if (body.classified_as.id !== 'gan:CMTY_QUANT' || body.value === undefined) {
    return undefined;
  }
  return body.unit?._label
    ? `${body.value} ${body.unit._label}`
    : String(body.value);
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

function getEntityKindLabel(
  classificationId: EntityClassificationId | undefined,
) {
  switch (classificationId) {
    case 'gan:LOC_NAME':
    case 'gan:LOC_ADJ':
      return 'Place';
    case 'gan:PER_NAME':
    case 'gan:PER_ATTR':
    case 'gan:PRF':
    case 'gan:STATUS':
    case 'gan:ETH_REL':
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

function placePreview(
  anchor: HoverAnchor,
  cardWidth: number,
  cardHeight: number,
): CSSProperties {
  const margin = 8;
  const gap = 8;
  const maxLeft = Math.max(margin, window.innerWidth - cardWidth - margin);
  const maxTop = Math.max(margin, window.innerHeight - cardHeight - margin);
  const left = clamp(anchor.left, margin, maxLeft);
  const belowTop = anchor.bottom + gap;
  const aboveTop = anchor.top - cardHeight - gap;
  const spaceBelow = window.innerHeight - margin - belowTop;
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
