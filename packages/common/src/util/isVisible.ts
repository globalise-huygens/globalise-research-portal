export function isVisible(
  container: Element,
  element: Element,
  topInset = 0,
): boolean {
  const bounds = container.getBoundingClientRect();
  const rect = element.getBoundingClientRect();
  const isBelowTop = rect.top >= bounds.top + topInset;
  const isAboveBottom = rect.bottom <= bounds.bottom;
  return isBelowTop && isAboveBottom;
}
