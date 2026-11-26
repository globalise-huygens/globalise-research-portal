import { getFocusableTreeWalker } from '@react-aria/focus';

type FocusableElement = HTMLElement | SVGElement;

type ModifierKeys = Pick<KeyboardEvent, 'shiftKey' | 'altKey' | 'ctrlKey' | 'metaKey'>;

export function getFocusTarget(trigger: Element): FocusableElement | undefined {
  if (isFocusable(trigger) && trigger.tabIndex >= 0) {
    return trigger;
  }
  return getFocusableElements(trigger)[0];
}

export function getFocusableElements(container: Element) {
  const walker = getFocusableTreeWalker(container, { tabbable: true });
  const elements: FocusableElement[] = [];
  while (walker.nextNode()) {
    elements.push(walker.currentNode as FocusableElement);
  }
  return elements;
}

export function focusFirstIn(
  popup: HTMLElement | null,
  event: Pick<Event, 'preventDefault'>,
) {
  const first = popup && getFocusableElements(popup)[0];
  if (first) {
    event.preventDefault();
    first.focus({ preventScroll: true });
  }
}

export function moveFocusFromPreview(
  event: KeyboardEvent,
  popup: HTMLElement,
  trigger: FocusableElement,
  close: () => void,
) {
  if (event.key !== 'Tab') {
    return;
  }
  const elements = getFocusableElements(popup);
  if (event.shiftKey && event.target === elements[0]) {
    event.preventDefault();
    trigger.focus({ preventScroll: true });
  } else if (!event.shiftKey && event.target === elements.at(-1)) {
    const outside = getFocusableElements(document.body)
      .filter((element) => !popup.contains(element));
    const triggerIndex = outside.indexOf(trigger);
    const next = triggerIndex >= 0 ? outside[triggerIndex + 1] : undefined;
    if (next) {
      event.preventDefault();
      next.focus({ preventScroll: true });
      close();
    }
  }
}

export function isIgnoredKey(event: KeyboardEvent) {
  const hasTabModifier = event.altKey || event.ctrlKey || event.metaKey;
  const isModifiedTab = event.key === 'Tab' && hasTabModifier;
  return event.defaultPrevented || event.isComposing || isModifiedTab;
}

export function hasModifierKey(event: ModifierKeys) {
  return event.shiftKey || event.altKey || event.ctrlKey || event.metaKey;
}

function isFocusable(element: Element): element is FocusableElement {
  return element instanceof HTMLElement || element instanceof SVGElement;
}
