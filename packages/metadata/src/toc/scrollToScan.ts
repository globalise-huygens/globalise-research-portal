import type { RefObject } from 'react';

export function scrollToScan(list: HTMLElement, scan: HTMLElement, header: HTMLElement) {
  scrollToTocElement(list, scan, header.offsetHeight);
}

export function scrollToTocElement(
  list: HTMLElement,
  target: HTMLElement,
  offset = 0,
) {
  const listTop = list.getBoundingClientRect().top;
  const targetTop = target.getBoundingClientRect().top;
  const distanceToTarget = targetTop - listTop - offset;
  list.scrollTo({ top: list.scrollTop + distanceToTarget });
}

export type ScanScrollRefs = {
  listRef: RefObject<HTMLElement | null>;
  headerRef: RefObject<HTMLElement | null>;
  scanRef: RefObject<HTMLElement | null>;
};
