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

/**
 * Who updated the selected canvas?
 * Prevents accidental rewrites and update loops from the opposite pane
 */
export type CanvasSource =
  | 'facsimile'
  | 'transcription'
  // init, url or menu:
  | 'external';

export type ManifestViewerSlice = {
  selectedCanvas: number;
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

export const defaultManifestViewerSlice: ManifestViewerSlice = {
  selectedCanvas: 0,
  selectedCanvasSource: 'external',
  selectedCanvasAt: 0,
  canvases: {},
};

function createReadyCanvas(
  pages: AnnotationPage[],
) {
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
 * Initialize canvases record using manifest canvas order
 * so Object.values(canvases) returns the correct order
 * and selectedCanvas index can be used.
 */
export function initCanvases(canvasIds: Id[], selectedCanvas = 0) {
  const canvases: Record<Id, CanvasState> = {};
  for (const id of canvasIds) {
    canvases[id] = { ...emptyCanvasState };
  }
  setState({ canvases, selectedCanvas });
}

export async function loadCanvasAnnotationPages(
  canvasId: CanvasId,
  urls: string[],
) {
  const state = useDocumentStore.getState();
  const existing = state.canvases[canvasId];
  if (!existing) {
    return;
  }
  if (existing.isReady || existing.isLoading || existing.error) {
    return;
  }
  if (!urls.length) {
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
      urls.map((url) => fetchJson<AnnotationPage>(url)),
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

export function setSelectedCanvas(index: number, source: CanvasSource) {
  if (source === 'external') {
    setAfterPaneSyncThreshold(index, source);
  } else if (source === 'facsimile') {
    setSelectedFacsimileCanvas(index);
  } else if (source === 'transcription') {
    setSelectedTranscriptionCanvas(index);
  }
}

/**
 * Set selected canvas unless another pane wrote within the {@link paneSyncThreshold}.
 * This prevents a feedback loop between the transcription and facsimile panes
 * when a pane's sync scroll event triggers its own selection call.
 */
function setAfterPaneSyncThreshold(
  index: number,
  source: CanvasSource,
) {
  setState((s) => {
    const now = Date.now();
    if (now - s.selectedCanvasAt < paneSyncThreshold && s.selectedCanvasSource !== source) {
      console.debug('Prevent update loop between panes due to scroll syncing:', source);
      return s;
    }
    return {
      ...s,
      selectedCanvas: index,
      selectedCanvasSource: source,
      selectedCanvasAt: now,
    };
  });
}

const paneSyncThreshold = 1000; // ms
const setSelectedTranscriptionCanvas = debounce((index) => setAfterPaneSyncThreshold(index, 'transcription'), 500);
const setSelectedFacsimileCanvas = debounce((index) => setAfterPaneSyncThreshold(index, 'facsimile'), 200);

export function usePages(canvasId: CanvasId) {
  return useDocumentStore(useShallow((s) => {
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
  }));
}

export function useLoadCanvas() {
  return loadCanvasAnnotationPages;
}

const emptyAnnotations = {};

export function useAnnotations(
  canvasId: CanvasId,
): Record<Id, Annotation> {
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
  index: number,
  selectedCanvasSource: CanvasSource
} & (
  | { isInit: false, id: null } & CanvasState
  | { isInit: true, id: CanvasId } & CanvasState
  );

const emptyCanvasStatus: CanvasStatus = {
  ...emptyCanvasState,
  isInit: false,
  index: 0,
  id: null,
  selectedCanvasSource: 'external',
};

export function useSelectedCanvas(): CanvasStatus {
  return useDocumentStore(useShallow((s: DocumentState) => {
    const { selectedCanvas: index, selectedCanvasSource, canvases } = s;
    const id = Object.keys(canvases)[index];
    if (!id) {
      return emptyCanvasStatus;
    }
    return { isInit: true, id, index, ...canvases[id], selectedCanvasSource };
  }));
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