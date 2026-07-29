import { setState, useDocumentStore } from './DocumentStore';

export type TocState = {
  expandedDocIds: string[];
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