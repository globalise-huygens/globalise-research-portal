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

export type CanvasId = string;

export type CanvasState = {
  annotations: Record<Id, Annotation> | null;
  partOf: PartOf | null;
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
};

export type ManifestViewerSlice = {
  indexes: AnnotationIndexes;
  selectedCanvas: number;

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
  partOf: null,
  isLoading: false,
  isReady: false,
  error: null,
};

export const defaultManifestViewerSlice: ManifestViewerSlice = {
  selectedCanvas: 0,
  canvases: {},
  indexes: emptyAnnotationIndex,
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

  return {
    annotations: mapped,
    partOf,
    isLoading: false,
    isReady: true,
    error: null,
    pageId,
  };
}

function mergeIndexes(
  prev: AnnotationIndexes,
  update: AnnotationIndexes,
) {
  const nextIndexes = { ...prev };
  for (const key in prev) {
    const k = key as keyof AnnotationIndexes;
    if (k === 'blockToLines' || k === 'entityToWords') {
      nextIndexes[k] = { ...prev[k], ...update[k] };
    } else {
      nextIndexes[k] = { ...prev[k], ...update[k] };
    }
  }
  return nextIndexes;
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
  setState({ canvases, selectedCanvas, indexes: emptyAnnotationIndex });
}

export async function loadCanvas(canvasId: CanvasId, urls: string[]) {
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
        [canvasId]: { ...emptyCanvasState },
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

    setState((s) => {
      const { pageId, ...canvasState } = createReadyCanvas(success);

      const canvases = {
        ...s.canvases,
        [canvasId]: canvasState,
      };
      const canvasIndexes = indexAnnotations(canvasState.annotations, pageId);
      const indexes = mergeIndexes(s.indexes, canvasIndexes);
      return { canvases, indexes };
    });
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error';
    setState((s) => ({
      canvases: {
        ...s.canvases,
        [canvasId]: { ...emptyCanvasState, error, isLoading: false, isReady: false },
      },
    }));
  }
}

export function setSelectedCanvas(index: number) {
  setState({ selectedCanvas: index });
}

export function usePages(canvasId: CanvasId) {
  return useDocumentStore(useShallow((s) => {
    const canvas = s.canvases[canvasId];
    const isReady = !!(canvas && !canvas.isLoading && !canvas.error && canvas.annotations);
    const hasAnnotations = isReady && Object.keys(canvas.annotations ?? {}).length;

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
  return loadCanvas;
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

export function usePartOf(canvasId: CanvasId): PartOf | null {
  return useDocumentStore((s) => {
    const canvas = s.canvases[canvasId] || orThrow('No canvas');
    return canvas.partOf;
  });
}

type CanvasStatus =
  | { isInit: false, index: number, id: null } & CanvasState
  | { isInit: true, index: number, id: CanvasId } & CanvasState;

const emptyCanvasStatus: CanvasStatus = {
  ...emptyCanvasState,
  isInit: false,
  index: 0,
  id: null,
};

export function useSelectedCanvas(): CanvasStatus {
  return useDocumentStore(useShallow((s: DocumentState) => {
    const index = s.selectedCanvas;
    const id = Object.keys(s.canvases)[index];
    if (!id) {
      return emptyCanvasStatus;
    }
    return { isInit: true, id, index, ...s.canvases[id] };
  }));
}

export function useIsCanvasInit(id?: CanvasId): boolean {
  return useDocumentStore((s) => {
    return !!(id && s.canvases[id]);
  });
}