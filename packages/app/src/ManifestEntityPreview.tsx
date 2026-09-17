import {
  fetchJson,
  getJsonUrl,
  getValue,
  getValues,
} from '@globalise/common';
import {
  getCidocEntityClassificationId,
  getEntityClassificationDefinition,
  getEntityClassificationUri,
  getPrimaryEntityBody,
  getEntityDateTimespan,
  getEntitySubject,
  isEntity,
  type Annotation,
  type EntityBody,
  type CidocEntityClassificationId,
  type EntityPreviewStrategy,
} from '@globalise/common/annotation';
import {
  getConceptLabel,
  isSkosConcept,
  type SkosConcept,
} from '@globalise/object-card';
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
  IconArrowTopRight,
  type EntityPreviewCardData,
  type EntityPreviewCardType,
  type EntityPreviewCardProperty,
} from '@globalise/design';
import { useQuery } from '@tanstack/react-query';
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

const OPEN_DELAY = 300;
const CLOSE_DELAY = 200;
const GLOBALISE_DATA_ORIGIN = 'https://data.globalise.huygens.knaw.nl';
const GLOBALISE_THESAURUS_BASE =
  `${GLOBALISE_DATA_ORIGIN}/hdl:20.500.14722/thesaurus:`;
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

type EntityAnnotation = Annotation<EntityBody>;
type LinkedConceptReference = {
  kind: 'concept';
  uri: string;
  fallbackLabel: string;
};

type LinkedClassificationReference = {
  kind: 'classification';
  uri: string;
  identifier: string;
  label: string;
};

type LinkedPreviewReference =
  | LinkedClassificationReference
  | LinkedConceptReference;

type PreviewStackSide = 'below' | 'left' | 'right';

export function ManifestEntityPreview() {
  const [displayed, setDisplayed] = useState<EntityAnnotation | null>(null);
  const [anchor, setAnchor] = useState<Element | null>(null);
  const [position, setPosition] = useState<CSSProperties>({
    left: 0,
    top: 0,
    visibility: 'hidden',
  });
  const [previewStack, setPreviewStack] = useState<LinkedPreviewReference[]>([]);
  const [previewStackSide, setPreviewStackSide] = useState<PreviewStackSide>('right');
  const previewRef = useRef<HTMLDivElement>(null);
  const previewStackRef = useRef<HTMLDivElement>(null);
  const displayedRef = useRef<EntityAnnotation | null>(null);
  const openTimer = useRef<number | undefined>(undefined);
  const closeTimer = useRef<number | undefined>(undefined);
  const previewStackCloseTimer = useRef<number | undefined>(undefined);
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
        setPreviewStack([]);
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
    window.clearTimeout(previewStackCloseTimer.current);
  }, []);

  useEffect(() => {
    function dismiss() {
      window.clearTimeout(openTimer.current);
      window.clearTimeout(closeTimer.current);
      window.clearTimeout(previewStackCloseTimer.current);
      openTimer.current = undefined;
      isPreviewHovered.current = false;
      const trigger = anchor ?? getHoverElement();
      if (trigger) {
        removeHoverAttribute(trigger);
      }
      displayedRef.current = null;
      setDisplayed(null);
      setAnchor(null);
      setPreviewStack([]);
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

  useLayoutEffect(() => {
    const preview = previewRef.current;
    const stack = previewStackRef.current;
    if (!preview || !stack || previewStack.length === 0) {
      return;
    }

    const updateStackSide = () => {
      const previewRect = preview.getBoundingClientRect();
      const stackRect = stack.getBoundingClientRect();
      const gap = 8;
      const margin = 8;
      const fitsRight = previewRect.right + gap + stackRect.width
        <= window.innerWidth - margin;
      const fitsLeft = previewRect.left - gap - stackRect.width >= margin;
      setPreviewStackSide(fitsRight ? 'right' : fitsLeft ? 'left' : 'below');
    };

    updateStackSide();
    const resizeObserver = new ResizeObserver(updateStackSide);
    resizeObserver.observe(stack);
    window.addEventListener('resize', updateStackSide);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateStackSide);
    };
  }, [previewStack]);

  if (!displayed) {
    return null;
  }

  function close() {
    displayedRef.current = null;
    setDisplayed(null);
    setAnchor(null);
    setPreviewStack([]);
  }

  function openPreviewAt(index: number, reference: LinkedPreviewReference) {
    window.clearTimeout(previewStackCloseTimer.current);
    setPreviewStack((current) => {
      if (current[index]?.uri === reference.uri) {
        return current.slice(0, index + 1);
      }
      return [...current.slice(0, index), reference];
    });
  }

  function schedulePreviewStackClose(length: number) {
    window.clearTimeout(previewStackCloseTimer.current);
    previewStackCloseTimer.current = window.setTimeout(() => {
      setPreviewStack((current) => current.slice(0, length));
    }, CLOSE_DELAY);
  }

  function keepPreviewStackOpen() {
    window.clearTimeout(previewStackCloseTimer.current);
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
        keepPreviewStackOpen();
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
        keepPreviewStackOpen();
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
      <EntityAnnotationPreviewCard
        annotation={displayed}
        onOpenPreview={(reference) => openPreviewAt(0, reference)}
        onSchedulePreviewClose={() => schedulePreviewStackClose(0)}
      />
      {previewStack.length > 0 && (
        <div
          ref={previewStackRef}
          className={`manifest-entity-preview__stack is-${previewStackSide}`}
          onPointerEnter={keepPreviewStackOpen}
          onFocusCapture={keepPreviewStackOpen}
        >
          {previewStack.map((reference, index) => (
            <LinkedPreview
              key={`${index}-${reference.uri}`}
              reference={reference}
              onOpenPreview={(nextReference) => openPreviewAt(index + 1, nextReference)}
              onScheduleClose={() => schedulePreviewStackClose(index + 1)}
              onKeepOpen={keepPreviewStackOpen}
            />
          ))}
        </div>
      )}
    </div>,
    document.body,
  );
}

function EntityAnnotationPreviewCard({
  annotation,
  onOpenPreview,
  onSchedulePreviewClose,
}: {
  annotation: EntityAnnotation;
  onOpenPreview: (reference: LinkedPreviewReference) => void;
  onSchedulePreviewClose: () => void;
}) {
  const body = getPrimaryEntityBody(annotation);
  const conceptReference = getClassificationConceptReference(body);
  const concept = useLinkedConcept(conceptReference);

  return (
    <EntityPreviewCard
      data={getPreviewData(
        annotation,
        conceptReference,
        concept.data,
        onOpenPreview,
        onSchedulePreviewClose,
      )}
    />
  );
}

function LinkedPreview({
  reference,
  onOpenPreview,
  onScheduleClose,
  onKeepOpen,
}: {
  reference: LinkedPreviewReference;
  onOpenPreview: (reference: LinkedPreviewReference) => void;
  onScheduleClose: () => void;
  onKeepOpen: () => void;
}) {
  if (reference.kind === 'classification') {
    return (
      <LinkedPreviewContainer
        onScheduleClose={onScheduleClose}
        onKeepOpen={onKeepOpen}
      >
        <EntityPreviewCard data={getClassificationPreviewData(reference)} />
      </LinkedPreviewContainer>
    );
  }

  return (
    <LinkedConceptPreview
      reference={reference}
      onOpenPreview={onOpenPreview}
      onScheduleClose={onScheduleClose}
      onKeepOpen={onKeepOpen}
    />
  );
}

function LinkedConceptPreview({
  reference,
  onOpenPreview,
  onScheduleClose,
  onKeepOpen,
}: {
  reference: LinkedConceptReference;
  onOpenPreview: (reference: LinkedPreviewReference) => void;
  onScheduleClose: () => void;
  onKeepOpen: () => void;
}) {
  const concept = useLinkedConcept(reference);

  return (
    <LinkedPreviewContainer
      onScheduleClose={onScheduleClose}
      onKeepOpen={onKeepOpen}
    >
      <EntityPreviewCard
        data={getConceptPreviewData(
          reference,
          concept.data,
          onOpenPreview,
          onScheduleClose,
        )}
      />
    </LinkedPreviewContainer>
  );
}

function LinkedPreviewContainer({
  children,
  onScheduleClose,
  onKeepOpen,
}: {
  children: ReactNode;
  onScheduleClose: () => void;
  onKeepOpen: () => void;
}) {
  return (
    <div
      className="manifest-entity-preview__stack-card"
      onPointerEnter={onKeepOpen}
      onPointerLeave={onScheduleClose}
      onFocusCapture={onKeepOpen}
      onBlurCapture={(event) => {
        if (
          event.relatedTarget instanceof Node
          && event.currentTarget.contains(event.relatedTarget)
        ) {
          return;
        }
        onScheduleClose();
      }}
    >
      {children}
    </div>
  );
}

function useLinkedConcept(reference: LinkedConceptReference | undefined) {
  return useQuery({
    queryKey: ['manifest-entity-preview-concept', reference?.uri],
    enabled: Boolean(reference),
    staleTime: Infinity,
    retry: false,
    queryFn: async ({ signal }) => {
      if (!reference) {
        throw new Error('Expected a linked concept reference');
      }
      const value = await fetchJson<unknown>(getJsonUrl(reference.uri), { signal });
      if (!isSkosConcept(value)) {
        throw new Error(`Expected a SKOS concept at ${reference.uri}`);
      }
      return value;
    },
  });
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

function getPreviewData(
  annotation: EntityAnnotation,
  conceptReference: LinkedConceptReference | undefined,
  concept: SkosConcept | undefined,
  onOpenPreview: (reference: LinkedPreviewReference) => void,
  onSchedulePreviewClose: () => void,
): EntityPreviewCardData {
  const body = getPrimaryEntityBody(annotation);
  const classificationId = getCidocEntityClassificationId(annotation);
  const definition = getPreviewDefinition(
    classificationId,
  );
  const classificationReference = classificationId
    ? getClassificationReference(body, classificationId)
    : undefined;
  return {
    type: definition.type,
    icon: <EntityIcon type={definition.type} />,
    openFullCardHref: getLinkedObjectCardHref(body),
    title: definition.getTitle(body),
    properties: [
      {
        label: 'Entity type',
        value: definition.typeLabel ?? getEntityTypeLabel(definition.type),
      },
      ...(definition.getProperties?.({
        body,
        concept,
        conceptReference,
        onOpenPreview,
        onSchedulePreviewClose,
      }) ?? []),
      {
        label: 'Classified by',
        value: classificationReference ? (
          <LinkedPreviewValue
            reference={classificationReference}
            onOpenPreview={onOpenPreview}
            onSchedulePreviewClose={onSchedulePreviewClose}
          />
        ) : body.classified_as._label,
      },
    ],
  };
}

function getConceptPreviewData(
  reference: LinkedConceptReference,
  concept: SkosConcept | undefined,
  onOpenPreview: (reference: LinkedPreviewReference) => void,
  onSchedulePreviewClose: () => void,
): EntityPreviewCardData {
  const properties: EntityPreviewCardProperty[] = [];
  const definition = getValue(concept?.definition);
  const alternativeLabels = getValues(concept?.altLabel);
  if (definition) {
    properties.push({ label: 'Definition', value: definition });
  }
  if (alternativeLabels.length > 0) {
    properties.push({ label: 'Alt label', value: alternativeLabels.join(', ') });
  }
  const schemes = getConceptRelations(concept?.inScheme);
  if (schemes.length > 0) {
    properties.push({
      label: 'Scheme',
      value: renderConceptRelations(
        schemes,
        onOpenPreview,
        onSchedulePreviewClose,
      ),
    });
  }
  const broader = getConceptRelations(concept?.broader);
  if (broader.length > 0) {
    properties.push({
      label: 'Broader',
      value: renderConceptRelations(
        broader,
        onOpenPreview,
        onSchedulePreviewClose,
      ),
    });
  }

  return {
    type: 'concept',
    icon: <EntityIcon type="concept" />,
    openFullCardHref: getObjectCardHref(reference.uri),
    openFullCardLabel: `Open ${concept
      ? getConceptLabel(concept)
      : reference.fallbackLabel} in a full object card`,
    title: concept ? getConceptLabel(concept) : reference.fallbackLabel,
    properties,
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
    kind: 'concept',
    uri,
    fallbackLabel: classification._label ?? body.label ?? 'Concept',
  };
}

function getClassificationReference(
  body: EntityBody,
  classificationId: CidocEntityClassificationId,
): LinkedClassificationReference {
  return {
    kind: 'classification',
    uri: getEntityClassificationUri(classificationId),
    identifier: classificationId.replace(/^gan:/, ''),
    label: body.classified_as._label,
  };
}

function getInternalConceptUri(uri: string): string | undefined {
  try {
    const parsed = new URL(uri);
    if (
      parsed.protocol === 'https:'
      && parsed.origin === GLOBALISE_DATA_ORIGIN
      && parsed.pathname.includes('/thesaurus:')
    ) {
      return uri.replace(/\.json$/, '');
    }
    const poolPartyMatch = parsed.hostname === 'digitaalerfgoed.poolparty.biz'
      ? /^\/globalise\/([0-9a-f-]+)\/?$/i.exec(parsed.pathname)
      : null;
    return poolPartyMatch
      ? `${GLOBALISE_THESAURUS_BASE}${poolPartyMatch[1]}`
      : undefined;
  } catch {
    return undefined;
  }
}

function getConceptRelations(
  relations: SkosConcept[] | undefined,
): LinkedConceptReference[] {
  return (relations ?? []).flatMap((relation) => {
    const uri = getInternalConceptUri(relation.id);
    return uri ? [{
      kind: 'concept' as const,
      uri,
      fallbackLabel: getConceptLabel(relation) || relation.id,
    }] : [];
  });
}

function renderConceptRelations(
  relations: LinkedConceptReference[],
  onOpenPreview: (reference: LinkedPreviewReference) => void,
  onSchedulePreviewClose: () => void,
) {
  return relations.map((reference, index) => (
    <span key={reference.uri}>
      {index > 0 && ', '}
      <LinkedPreviewValue
        reference={reference}
        onOpenPreview={onOpenPreview}
        onSchedulePreviewClose={onSchedulePreviewClose}
      />
    </span>
  ));
}

function LinkedPreviewValue({
  reference,
  label = getLinkedPreviewLabel(reference),
  onOpenPreview,
  onSchedulePreviewClose,
}: {
  reference: LinkedPreviewReference;
  label?: string;
  onOpenPreview: (reference: LinkedPreviewReference) => void;
  onSchedulePreviewClose: () => void;
}) {
  const sharedProps = {
    className: 'manifest-entity-preview__linked-value',
    onPointerEnter: () => onOpenPreview(reference),
    onPointerLeave: onSchedulePreviewClose,
    onFocus: () => onOpenPreview(reference),
    onBlur: onSchedulePreviewClose,
  };
  const content = (
    <>
      <span>{label}</span>
      <IconArrowTopRight aria-hidden="true" />
    </>
  );

  if (reference.kind === 'classification') {
    return (
      <button
        {...sharedProps}
        type="button"
        onClick={() => onOpenPreview(reference)}
        aria-label={`Preview classification: ${label}`}
      >
        {content}
      </button>
    );
  }

  return (
    <a
      {...sharedProps}
      href={getObjectCardHref(reference.uri)}
    >
      {content}
    </a>
  );
}

function getLinkedPreviewLabel(reference: LinkedPreviewReference): string {
  return reference.kind === 'concept'
    ? reference.fallbackLabel
    : reference.label;
}

function getLinkedObjectCardHref(body: EntityBody): string | undefined {
  const subject = getEntitySubject(body);
  const uri = subject?.id;
  if (!uri || uri.includes('#') || uri.includes('/annotations:')) {
    return undefined;
  }
  try {
    const parsed = new URL(uri);
    if (parsed.protocol !== 'https:' || parsed.origin !== GLOBALISE_DATA_ORIGIN) {
      return undefined;
    }
  } catch {
    return undefined;
  }
  return `/object-card?uri=${encodeURIComponent(uri)}`;
}

function getObjectCardHref(uri: string): string {
  return `/object-card?uri=${encodeURIComponent(uri)}`;
}

function getNamedPreviewTitle(body: EntityBody) {
  return body.label
    ?? body.ascribes_appellation?.content
    ?? body.classified_as._label;
}

function getDatePreviewProperties(body: EntityBody): EntityPreviewCardProperty[] {
  const date = getEntityDateTimespan(body);
  if (date?.type !== 'TimeSpan') {
    return [];
  }

  const dateBounds = [
    ['Begin of the begin', date.begin_of_the_begin],
    ['End of the begin', date.end_of_the_begin],
    ['Begin of the end', date.begin_of_the_end],
    ['End of the end', date.end_of_the_end],
  ] as const;

  return dateBounds.flatMap(([label, value]) => value
    ? [{ label, value: formatPreviewDate(value) }]
    : []);
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

type EntityPreviewDefinition = {
  type: EntityPreviewCardType;
  typeLabel?: string;
  getTitle: (body: EntityBody) => string;
  getProperties?: (context: EntityPreviewContext) => EntityPreviewCardProperty[];
};

type EntityPreviewContext = {
  body: EntityBody;
  concept?: SkosConcept;
  conceptReference?: LinkedConceptReference;
  onOpenPreview: (reference: LinkedPreviewReference) => void;
  onSchedulePreviewClose: () => void;
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
  getProperties: ({
    body,
    concept,
    conceptReference,
    onOpenPreview,
    onSchedulePreviewClose,
  }) => [{
    label: 'Classified as',
    value: conceptReference ? (
      <LinkedPreviewValue
        reference={conceptReference}
        label={concept ? getConceptLabel(concept) : conceptReference.fallbackLabel}
        onOpenPreview={onOpenPreview}
        onSchedulePreviewClose={onSchedulePreviewClose}
      />
    ) : body.label ?? body.ascribes_appellation?.content ?? '—',
  }],
};

const datePreview: EntityPreviewBehavior = {
  getTitle: getNamedPreviewTitle,
  getProperties: ({ body }) => getDatePreviewProperties(body),
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
  date: datePreview,
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
