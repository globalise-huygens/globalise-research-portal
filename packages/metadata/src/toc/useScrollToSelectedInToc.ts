import { useLayoutEffect, type RefObject } from 'react';
import { clearTocNavigation, useTocNavigation } from '@globalise/common/document';
import { scrollToScan, scrollToTocElement, type ScanScrollRefs } from './scrollToScan';

export type ScrollToSelectedInTocProps = ScanScrollRefs & {
  isCurrent: boolean;
  isExpanded: boolean;
  articleRef: RefObject<HTMLElement | null>;
};

export function useScrollToSelectedInToc(
  {
    isCurrent,
    isExpanded,
    listRef,
    articleRef,
    headerRef,
    scanRef,
  }: ScrollToSelectedInTocProps,
) {
  const navigation = useTocNavigation();

  useLayoutEffect(
    scrollToSelected,
    [isCurrent, isExpanded, navigation, listRef, articleRef, headerRef, scanRef],
  );

  function scrollToSelected() {
    const list = listRef.current;
    const article = articleRef.current;
    const header = headerRef.current;
    const scan = scanRef.current;
    if (!isCurrent || !list || !header) {
      return;
    }
    if (navigation === 'document' && article) {
      scrollToTocElement(list, article);
      header.focus({ preventScroll: true });
      clearTocNavigation();
    }
    if (navigation === 'scan' && scan) {
      scrollToScan(list, scan, header);
      scan.focus({ preventScroll: true });
      clearTocNavigation();
    }
  }
}
