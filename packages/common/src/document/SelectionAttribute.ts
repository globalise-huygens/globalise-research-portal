export type SelectionHoverDelay = 'immediate' | 'delayed';

const HOVER_ATTRIBUTE = 'data-hover';

export function setHoverAttribute(
  element: Element,
  delay: SelectionHoverDelay = 'immediate',
) {
  const previous = getHoverElement();
  if (previous && previous !== element) {
    removeHoverAttribute(previous);
  }
  element.setAttribute(HOVER_ATTRIBUTE, delay);
}

export function removeHoverAttribute(element: Element) {
  element.removeAttribute(HOVER_ATTRIBUTE);
}

export function getHoverElement() {
  return document.querySelector(`[${HOVER_ATTRIBUTE}]`);
}

export function getHoverDelay(element: Element): SelectionHoverDelay | null {
  return element.getAttribute(HOVER_ATTRIBUTE) as SelectionHoverDelay | null;
}
