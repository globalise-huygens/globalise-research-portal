import { setState, useDocumentStore } from './DocumentStore';

export type TocNavigation = 'document' | 'scan' | 'reveal';

type TocNavigationRequest = { target: TocNavigation; documentId: string };

export type TocState = {
  expandedDocIds: string[];
  navigation: TocNavigationRequest | null;
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

export function navigateToc(target: TocNavigation, documentId: string) {
  setState(({ toc }) => {
    const shouldExpand = target !== 'document'
      && !toc.expandedDocIds.includes(documentId);
    return {
      toc: {
        expandedDocIds: shouldExpand
          ? [...toc.expandedDocIds, documentId]
          : toc.expandedDocIds,
        navigation: { target, documentId },
      },
    };
  });
}

export function clearTocNavigation(request: TocNavigationRequest) {
  setState(({ toc }) => {
    if (toc.navigation !== request) {
      return { toc };
    }
    return { toc: { ...toc, navigation: null } };
  });
}

export function useTocNavigation(documentId: string) {
  return useDocumentStore(({ toc }) => {
    const request = toc.navigation;
    return request?.documentId === documentId ? request : null;
  });
}

export function useIsTocDocumentExpanded(id: string): boolean {
  return useDocumentStore((s) => s.toc.expandedDocIds.includes(id));
}
