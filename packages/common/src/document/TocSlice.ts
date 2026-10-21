import { setState, useDocumentStore } from './DocumentStore';

export type TocState = {
  expandedDocIds: string[];
  revealRequest: { documentIds: string[] } | null;
};

export type TocSlice = {
  toc: TocState;
};

export function toggleTocDocument(id: string) {
  setState((s) => {
    const { expandedDocIds } = s.toc;
    return {
      toc: {
        ...s.toc,
        expandedDocIds: expandedDocIds.includes(id)
          ? expandedDocIds.filter((expandedId) => expandedId !== id)
          : [...expandedDocIds, id],
      },
    };
  });
}

export function expandTocDocument(id: string) {
  setState((s) => {
    const { expandedDocIds } = s.toc;
    if (expandedDocIds.includes(id)) {
      return s;
    }
    return {
      toc: { ...s.toc, expandedDocIds: [...expandedDocIds, id] },
    };
  });
}

export function useIsTocDocumentExpanded(id: string): boolean {
  return useDocumentStore((s) => s.toc.expandedDocIds.includes(id));
}

/** Reveal document details without changing the selected scan or viewer position. */
export function revealTocDocuments(documentIds: string[]) {
  if (!documentIds.length) {
    return;
  }
  setState((s) => ({
    toc: {
      ...s.toc,
      expandedDocIds: [...new Set([...s.toc.expandedDocIds, ...documentIds])],
      revealRequest: { documentIds },
    },
  }));
}

export function clearTocRevealRequest() {
  setState((s) => ({ toc: { ...s.toc, revealRequest: null } }));
}
