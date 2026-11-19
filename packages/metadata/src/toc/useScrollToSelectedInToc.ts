import { useEffect, type RefObject } from 'react';
import { clearTocNavigation, useTocNavigation } from '@globalise/common/document';
import { scrollToScan, scrollToTocElement, type ScanScrollRefs } from './scrollToScan';

export type ScrollToSelectedInTocProps = ScanScrollRefs & {
  documentId: string;
  isExpanded: boolean;
  articleRef: RefObject<HTMLElement | null>;
};

export function useScrollToSelectedInToc(
  {
    documentId,
    isExpanded,
    listRef,
    articleRef,
    headerRef,
    scanRef,
  }: ScrollToSelectedInTocProps,
) {
  const navigation = useTocNavigation(documentId);

  // On mobile, revealing a document mounts the list and its items together.
  useEffect(
    scrollToSelected,
    [isExpanded, navigation, listRef, articleRef, headerRef, scanRef],
  );

  function scrollToSelected() {
    const list = listRef.current;
    const article = articleRef.current;
    const header = headerRef.current;
    const scan = scanRef.current;
    if (!navigation || !list || !header) {
      return;
    }
    if (navigation.target === 'scan') {
      if (!scan) {
        return;
      }
      scrollToScan(list, scan, header);
      scan.focus({ preventScroll: true });
      clearTocNavigation(navigation);
      return;
    }
    if (!article) {
      return;
    }

    const focusDocument = () => {
      scrollToTocElement(list, article);
      header.focus({ preventScroll: true });
      clearTocNavigation(navigation);
    };
    if (navigation.target === 'document') {
      focusDocument();
      return;
    }
    return afterSidebarResize(list, focusDocument);
  }
}

function afterSidebarResize(list: HTMLElement, focusDocument: () => void) {
  // Opening the sidebar changes the height of wrapped document titles.
  let timer: ReturnType<typeof setTimeout>;
  const observer = new ResizeObserver(() => {
    clearTimeout(timer);
    timer = setTimeout(focusDocument, 80);
  });
  observer.observe(list);
  return () => {
    observer.disconnect();
    clearTimeout(timer);
  };
}
