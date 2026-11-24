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
  let cancelled = false;
  const frame = requestAnimationFrame(() => {
    const transitions = [];
    for (
      let element: HTMLElement | null = list;
      element;
      element = element.parentElement
    ) {
      for (const animation of element.getAnimations()) {
        if ('transitionProperty' in animation
          && (animation.transitionProperty === 'width'
            || animation.transitionProperty === 'grid-template-columns')) {
          transitions.push(animation.finished);
        }
      }
    }

    // Wait for layout to settle before measuring the wrapped document title.
    void Promise.allSettled(transitions).then(() => {
      if (!cancelled) {
        focusDocument();
      }
    });
  });
  return () => {
    cancelled = true;
    cancelAnimationFrame(frame);
  };
}
