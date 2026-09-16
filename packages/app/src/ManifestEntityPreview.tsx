import {
  getCidocEntityClassificationId,
  getPrimaryEntityBody,
  getEntityDateTimespan,
  isEntity,
  type Annotation,
  type EntityBody,
  type CidocEntityClassificationId,
} from '@globalise/common/annotation';
import {
  getHoverDelay,
  getHoverElement,
  removeHoverAttribute,
  setHovered,
  useDocumentStore,
  type DocumentState,
} from '@globalise/common/document';
import {
  EntityPreviewCard,
  EntityIcon,
  getEntityTypeLabel,
  type EntityPreviewCardData,
  type EntityPreviewCardType,
  type EntityPreviewCardProperty,
} from '@globalise/design';
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { createPortal } from 'react-dom';
import './ManifestEntityPreview.css';

const OPEN_DELAY = 300;
const CLOSE_DELAY = 200;
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

type EntityAnnotation = Annotation<EntityBody>;

export function ManifestEntityPreview() {
  const [displayed, setDisplayed] = useState<EntityAnnotation | null>(null);
  const [anchor, setAnchor] = useState<Element | null>(null);
  const [position, setPosition] = useState<CSSProperties>({
    left: 0,
    top: 0,
    visibility: 'hidden',
  });
  const previewRef = useRef<HTMLDivElement>(null);
  const displayedRef = useRef<EntityAnnotation | null>(null);
  const openTimer = useRef<number | undefined>(undefined);
  const closeTimer = useRef<number | undefined>(undefined);
  const isPreviewHovered = useRef(false);

  useEffect(() => useDocumentStore.subscribe(({ hoveredId }) => {
    const nextAnchor = hoveredId
      ? getHoverElement()
      : null;
    const annotation = getHoveredAnnotation(
      useDocumentStore.getState(),
      hoveredId,
    );
    if (annotation && nextAnchor) {
      const openImmediately = getHoverDelay(nextAnchor) === 'immediate';
      window.clearTimeout(openTimer.current);
      openTimer.current = undefined;
      window.clearTimeout(closeTimer.current);
      if (displayedRef.current?.id === annotation.id) {
        setAnchor(nextAnchor);
        return;
      }
      openTimer.current = window.setTimeout(() => {
        openTimer.current = undefined;
        displayedRef.current = annotation;
        setDisplayed(annotation);
        setAnchor(nextAnchor);
      }, displayedRef.current || openImmediately ? 0 : OPEN_DELAY);
      return;
    }

    window.clearTimeout(openTimer.current);
    openTimer.current = undefined;
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
      displayedRef.current = null;
      setDisplayed(null);
      setAnchor(null);
    }, CLOSE_DELAY);
  }), []);

  useEffect(() => () => {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
  }, []);

  useEffect(() => {
    function dismiss() {
      window.clearTimeout(openTimer.current);
      window.clearTimeout(closeTimer.current);
      openTimer.current = undefined;
      isPreviewHovered.current = false;
      const trigger = anchor ?? getHoverElement();
      if (trigger) {
        removeHoverAttribute(trigger);
      }
      displayedRef.current = null;
      setDisplayed(null);
      setAnchor(null);
      setHovered(null);
    }

    function handleMovement(event: Event) {
      if (event.target instanceof Node && previewRef.current?.contains(event.target)) {
        return;
      }
      if (displayedRef.current || openTimer.current !== undefined) {
        dismiss();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Tab' && displayedRef.current && anchor) {
        const preview = previewRef.current;
        const activeElement = document.activeElement;
        const previewActions = getFocusableElements(preview);
        const firstAction = previewActions.at(0) ?? preview;
        const lastAction = previewActions.at(-1) ?? preview;

        if (!event.shiftKey && activeElement === anchor && firstAction) {
          event.preventDefault();
          firstAction.focus({ preventScroll: true });
          return;
        }

        if (event.shiftKey && activeElement === firstAction) {
          event.preventDefault();
          focusElement(anchor);
          return;
        }

        if (!event.shiftKey && activeElement === lastAction && preview) {
          const nextElement = getNextFocusableElement(anchor, preview);
          if (nextElement) {
            event.preventDefault();
            dismiss();
            nextElement.focus({ preventScroll: true });
          }
          return;
        }
      }

      if (event.key !== 'Escape' || (!displayedRef.current && openTimer.current === undefined)) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      if (previewRef.current?.contains(document.activeElement)
        && anchor?.isConnected) {
        focusElement(anchor);
      }
      dismiss();
    }

    window.addEventListener('scroll', handleMovement, true);
    window.addEventListener('wheel', handleMovement, { capture: true, passive: true });
    window.addEventListener('pointerdown', handleMovement, true);
    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      window.removeEventListener('scroll', handleMovement, true);
      window.removeEventListener('wheel', handleMovement, true);
      window.removeEventListener('pointerdown', handleMovement, true);
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [anchor]);

  useLayoutEffect(() => {
    const preview = previewRef.current;
    if (!displayed || !anchor || !preview) {
      return;
    }

    const updatePosition = () => {
      const rect = preview.getBoundingClientRect();
      const anchorRect = anchor.isConnected
        ? anchor.getBoundingClientRect()
        : undefined;
      if (!anchorRect) {
        setPosition((current) => ({ ...current, visibility: 'hidden' }));
        return;
      }
      if (anchorRect.bottom < 0 || anchorRect.top > window.innerHeight) {
        setPosition((current) => ({ ...current, visibility: 'hidden' }));
        return;
      }
      setPosition(placePreview(anchorRect, rect.width, rect.height));
    };

    updatePosition();
    const resizeObserver = new ResizeObserver(updatePosition);
    resizeObserver.observe(preview);
    window.addEventListener('resize', updatePosition);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updatePosition);
    };
  }, [anchor, displayed]);

  if (!displayed) {
    return null;
  }

  function close() {
    displayedRef.current = null;
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
      role="dialog"
      aria-label="Entity preview"
      tabIndex={-1}
      style={position}
      onPointerEnter={() => {
        isPreviewHovered.current = true;
        window.clearTimeout(closeTimer.current);
        setHovered(displayed.id);
      }}
      onPointerLeave={() => {
        isPreviewHovered.current = false;
        setHovered(null);
        scheduleClose();
      }}
      onFocusCapture={() => {
        isPreviewHovered.current = true;
        window.clearTimeout(closeTimer.current);
        setHovered(displayed.id);
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
    >
      <EntityPreviewCard data={getPreviewData(displayed)} />
    </div>,
    document.body,
  );
}

function getHoveredAnnotation(
  state: DocumentState,
  hoveredId: string | null,
): EntityAnnotation | null {
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
  const definition = getPreviewDefinition(
    getCidocEntityClassificationId(annotation),
  );
  return {
    type: definition.type,
    icon: <EntityIcon type={definition.type} />,
    openFullCardHref: getLinkedObjectCardHref(annotation),
    title: getPreviewTitle(annotation, definition),
    properties: getPreviewProperties(annotation, definition),
  };
}

function getLinkedObjectCardHref(annotation: EntityAnnotation): string | undefined {
  const body = getPrimaryEntityBody(annotation);
  const subject = body.has_appellative_subject
    ?? body.has_classificatory_subject
    ?? body.has_dimension_subject;
  const uri = subject?.id;
  if (!uri || uri.includes('#') || uri.includes('/annotations:')) {
    return undefined;
  }
  try {
    const parsed = new URL(uri);
    if (parsed.protocol !== 'https:' || parsed.hostname !== 'data.globalise.huygens.knaw.nl') {
      return undefined;
    }
  } catch {
    return undefined;
  }
  return `/object-card?uri=${encodeURIComponent(uri)}`;
}

function getPreviewTitle(
  annotation: EntityAnnotation,
  definition: EntityPreviewDefinition,
) {
  const body = getPrimaryEntityBody(annotation);
  if (isClassificationOnly(annotation)) {
    return 'Unknown';
  }
  return body.label
    ?? body.ascribes_appellation?.content
    ?? definition.getTitle?.(body)
    ?? body.classified_as._label;
}

function getPreviewProperties(
  annotation: EntityAnnotation,
  definition: EntityPreviewDefinition,
): EntityPreviewCardProperty[] {
  const body = getPrimaryEntityBody(annotation);
  const classificationId = getCidocEntityClassificationId(annotation);
  const properties: EntityPreviewCardProperty[] = [
    {
      label: 'Type',
      value: definition.typeLabel ?? getEntityTypeLabel(definition.type),
    },
    ...(definition.getProperties?.(body) ?? []),
  ];

  const date = getEntityDateTimespan(body);
  if (
    classificationId === 'gan:DATE'
    && date?.type === 'TimeSpan'
  ) {
    const dateBounds = [
      ['Begin of the begin', date.begin_of_the_begin],
      ['End of the begin', date.end_of_the_begin],
      ['Begin of the end', date.begin_of_the_end],
      ['End of the end', date.end_of_the_end],
    ] as const;
    for (const [label, value] of dateBounds) {
      if (value) {
        properties.push({ label, value: formatPreviewDate(value) });
      }
    }
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

const previewDateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

function formatPreviewDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value.split('T')[0] : previewDateFormatter.format(date);
}

function isClassificationOnly(annotation: EntityAnnotation) {
  const classificationId = getCidocEntityClassificationId(annotation);
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

type EntityPreviewDefinition = {
  type: EntityPreviewCardType;
  typeLabel?: string;
  getTitle?: (body: EntityBody) => string | undefined;
  getProperties?: (body: EntityBody) => EntityPreviewCardProperty[];
};

const fallbackPreviewDefinition: EntityPreviewDefinition = { type: 'entity' };

const previewDefinitionByClassificationId = {
  'gan:PER_NAME': { type: 'person' },
  'gan:PER_ATTR': { type: 'person' },
  'gan:PRF': { type: 'person' },
  'gan:STATUS': { type: 'person' },
  'gan:ETH_REL': { type: 'person' },
  'gan:ORG': { type: 'organisation' },
  'gan:SHIP': { type: 'ship' },
  'gan:SHIP_TYPE': { type: 'ship' },
  'gan:CMTY_NAME': { type: 'commodity' },
  'gan:CMTY_QUAL': { type: 'commodity' },
  'gan:DATE': { type: 'date' },
  'gan:LOC_NAME': { type: 'place' },
  'gan:LOC_ADJ': { type: 'place' },
  'gan:DOC': { type: 'document' },
  'gan:CMTY_QUANT': {
    type: 'dimensions',
    typeLabel: 'Exchange Unit',
    getTitle: (body: EntityBody) => body.value === undefined
      ? undefined
      : body.unit?._label
        ? `${body.value} ${body.unit._label}`
        : String(body.value),
    getProperties: (body: EntityBody) => [
      { label: 'Value', value: body.value ?? '-' },
      { label: 'Unit', value: body.unit?._label ?? '-' },
    ],
  },
} as const satisfies Record<CidocEntityClassificationId, EntityPreviewDefinition>;

function getPreviewDefinition(
  classificationId: CidocEntityClassificationId | undefined,
): EntityPreviewDefinition {
  return classificationId
    ? previewDefinitionByClassificationId[classificationId]
    : fallbackPreviewDefinition;
}

function placePreview(
  anchor: Pick<DOMRect, 'bottom' | 'left' | 'right' | 'top'>,
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

type FocusableElement = HTMLElement | SVGElement;

function getFocusableElements(container: Element | null): FocusableElement[] {
  if (!container) {
    return [];
  }
  return Array.from(
    container.querySelectorAll<FocusableElement>(FOCUSABLE_SELECTOR),
  ).filter((element) => element.getClientRects().length > 0);
}

function getNextFocusableElement(
  anchor: Element,
  preview: Element,
): FocusableElement | undefined {
  const elements = getFocusableElements(document.body)
    .filter((element) => !preview.contains(element));
  const anchorIndex = elements.indexOf(anchor as FocusableElement);
  return anchorIndex === -1 ? undefined : elements[anchorIndex + 1];
}

function focusElement(element: Element) {
  if (element instanceof HTMLElement || element instanceof SVGElement) {
    element.focus({ preventScroll: true });
  }
}
