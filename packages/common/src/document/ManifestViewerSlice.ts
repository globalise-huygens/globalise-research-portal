import { useShallow } from 'zustand/react/shallow';
import {
  Annotation,
  AnnotationPage,
  findTextPositionSelector,
  getPageText,
  Id,
  isEntity,
  PartOf,
} from '../annotation';
import { FetchError, fetchJson } from '../util/fetchJson';
import { type DocumentState, setState, useDocumentStore } from './DocumentStore';
import { orThrow } from '../util/orThrow.ts';
import {
  AnnotationIndexes,
  indexAnnotations,
} from '../annotation/indexAnnotations.ts';
import { debounce } from 'lodash';

export type CanvasId = string;

export type CanvasState = {
  annotations: Record<Id, Annotation> | null;
  indexes: AnnotationIndexes;
  partOf: PartOf | null;
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
};

export type CanvasSource =
  | 'facsimile'
  | 'transcription'
  | 'external';

export type ManifestViewerSlice = {
  selectedCanvasId: CanvasId | null;
  selectedCanvasSource: CanvasSource;
  selectedCanvasAt: number;
  /**
   * Canvas record
   * Note: Object.keys/values(canvases) returns canvases in manifest order
   */
  canvases: Record<Id, CanvasState>;
};

export const emptyAnnotationIndex: AnnotationIndexes = {
  wordToLine: {},
  lineToBlock: {},
  blockToLines: {},
  wordToBlock: {},
  entityToWords: {},
  entityToBlock: {},
};

const emptyCanvasState: CanvasState = {
  annotations: {},
  indexes: emptyAnnotationIndex,
  partOf: null,
  isLoading: false,
  isReady: false,
  error: null,
};

function createReadyCanvas(pages: AnnotationPage[]) {
  const mapped: Record<Id, Annotation> = {};
  for (const page of pages) {
    for (const item of page.items) {
      mapped[item.id] = item;
    }
  }

  const { id: pageId } = getPageText(mapped);
  for (const id in mapped) {
    const item = mapped[id];
    if (!isEntity(item)) {
      continue;
    }
    const foundSelector = findTextPositionSelector(item, pageId);
    if (!foundSelector) {
      delete mapped[id];
    }
  }
  const partOf = pages[0]?.partOf ?? null;
  const indexes = indexAnnotations(mapped, pageId);

  return {
    annotations: mapped,
    indexes,
    partOf,
    isLoading: false,
    isReady: true,
    error: null,
  };
}

/**
 * Initialize canvases record using manifest canvas order.
 * If selectedCanvasId exists, select it.
 * Otherwise, pick first canvas.
 */
export function initCanvases(canvasIds: Id[], selectedCanvasId?: CanvasId) {
  const canvases: Record<Id, CanvasState> = {};
  for (const id of canvasIds) {
    canvases[id] = { ...emptyCanvasState };
  }
  const nextSelected = selectedCanvasId && canvases[selectedCanvasId]
    ? selectedCanvasId
    : canvasIds[0] ?? null;
  setState({ canvases, selectedCanvasId: nextSelected });
}

export async function loadCanvasAnnotationPages(
  canvasId: CanvasId,
  annotationPageUrls: string[],
) {
  const state = useDocumentStore.getState();
  const existing = state.canvases[canvasId];
  if (!existing) {
    return;
  }
  if (existing.isReady || existing.isLoading || existing.error) {
    return;
  }
  if (!annotationPageUrls.length) {
    setState((s) => ({
      canvases: {
        ...s.canvases,
        [canvasId]: { ...emptyCanvasState, isReady: true },
      },
    }));
    return;
  }
  setState((s) => ({
    canvases: {
      ...s.canvases,
      [canvasId]: { ...emptyCanvasState, isLoading: true },
    },
  }));

  try {
    const results = await Promise.allSettled(
      annotationPageUrls.map((url) => fetchJson<AnnotationPage>(url)),
    );

    const success: AnnotationPage[] = [];
    const errors: Error[] = [];

    for (const result of results) {
      if (result.status === 'fulfilled') {
        success.push(result.value);
      } else {
        errors.push(result.reason);
      }
    }

    if (errors.length) {
      const isEntities403 = errors.every((e) =>
        e instanceof FetchError
        && e.status === 403
        && e.url.includes('entities'),
      );
      if (!isEntities403) {
        throw errors[0];
      }
    }

    setState((s) => ({
      canvases: {
        ...s.canvases,
        [canvasId]: createReadyCanvas(success),
      },
    }));
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error';
    setState((s) => ({
      canvases: {
        ...s.canvases,
        [canvasId]: {
          ...emptyCanvasState,
          error,
          isLoading: false,
          isReady: false,
        },
      },
    }));
  }
}

export function setSelectedCanvas(canvasId: CanvasId, source: CanvasSource) {
  if (source === 'external') {
    setAfterPaneSyncThreshold(canvasId, source);
  } else if (source === 'facsimile') {
    setSelectedFacsimileCanvas(canvasId);
  } else if (source === 'transcription') {
    setSelectedTranscriptionCanvas(canvasId);
  }
}

/**
 * Set selected canvas unless another pane wrote within the {@link paneSyncThreshold}.
 * This prevents a feedback loop between the transcription and facsimile panes
 * when a pane's sync scroll event triggers its own selection call.
 */
function setAfterPaneSyncThreshold(canvasId: CanvasId, source: CanvasSource) {
  setState((s) => {
    const now = Date.now();
    if (now - s.selectedCanvasAt < paneSyncThreshold && s.selectedCanvasSource !== source) {
      console.debug('Prevent update loop between panes due to scroll syncing:', source);
      return s;
    }
    return {
      ...s,
      selectedCanvasId: canvasId,
      selectedCanvasSource: source,
      selectedCanvasAt: now,
    };
  });
}

const paneSyncThreshold = 1000; // ms
const setSelectedTranscriptionCanvas = debounce(
  (canvasId: CanvasId) => setAfterPaneSyncThreshold(canvasId, 'transcription'), 500);
const setSelectedFacsimileCanvas = debounce(
  (canvasId: CanvasId) => setAfterPaneSyncThreshold(canvasId, 'facsimile'), 100);

export function usePages(canvasId: CanvasId) {
  return useDocumentStore(useShallow(
    (state) => getCanvasAnnotationPages(state, canvasId),
  ));
}

export function getCanvasAnnotationPages(s: DocumentState, canvasId: CanvasId) {
  const canvas = s.canvases[canvasId];
  const isReady = !!(canvas && !canvas.isLoading && !canvas.error && canvas.annotations);
  const hasAnnotations = isReady && !!Object.keys(canvas.annotations ?? {}).length;

  return {
    canvasId,
    hasAnnotations,
    isLoading: canvas?.isLoading ?? false,
    error: canvas?.error ?? null,
    isReady,
  };
}

export function useLoadCanvas() {
  return loadCanvasAnnotationPages;
}

const emptyAnnotations = {};

export function useAnnotations(canvasId: CanvasId): Record<Id, Annotation> {
  return useDocumentStore((s) => {
    const canvas = s.canvases[canvasId];
    const annotations = canvas?.annotations;
    return annotations ?? emptyAnnotations;
  });
}

export function useCanvasIndexes(canvasId: CanvasId): AnnotationIndexes {
  return useDocumentStore(
    (s) => s.canvases[canvasId]?.indexes ?? emptyAnnotationIndex,
  );
}

export function usePartOf(canvasId: CanvasId): PartOf | null {
  return useDocumentStore((s) => {
    const canvas = s.canvases[canvasId] || orThrow('No canvas');
    return canvas.partOf;
  });
}

type CanvasStatus = {
  selectedCanvasSource: CanvasSource
} & (
  | { isInit: false, id: null } & CanvasState
  | { isInit: true, id: CanvasId } & CanvasState
  );

const emptyCanvasStatus: CanvasStatus = {
  ...emptyCanvasState,
  isInit: false,
  id: null,
  selectedCanvasSource: 'external',
};

export function useSelectedCanvas(): CanvasStatus {
  return useDocumentStore(useShallow((s: DocumentState) => {
    const { selectedCanvasId, selectedCanvasSource, canvases } = s;
    const canvas = selectedCanvasId ? canvases[selectedCanvasId] : null;
    if (!selectedCanvasId || !canvas) {
      return emptyCanvasStatus;
    }
    return { isInit: true, id: selectedCanvasId, ...canvas, selectedCanvasSource };
  }));
}

/**
 * @returns index of selected canvas in manifest, or -1 if no canvas is selected
 */
export function useSelectedCanvasIndex(): number {
  return useDocumentStore((s) =>
    s.selectedCanvasId
      ? Object.keys(s.canvases).indexOf(s.selectedCanvasId)
      : -1,
  );
}

export function useIsCanvasInit(id?: CanvasId): boolean {
  return useDocumentStore((s) => !!(id && s.canvases[id]));
}

export const setStateLogged = (
  partial: Partial<DocumentState> | ((state: DocumentState) => Partial<DocumentState>),
) => {
  const state = useDocumentStore.getState();
  const update = typeof partial === 'function'
    ? partial(state)
    : partial;
  console.trace(update);
  setState(partial);
};