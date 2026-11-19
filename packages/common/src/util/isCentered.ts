export function isCentered(
  container: HTMLElement,
  element: HTMLElement,
): boolean {
  const scrollTop = container.scrollTop;
  const clientHeight = container.clientHeight;
  const scrollCenter = scrollTop + clientHeight / 2;

  const elementTop = element.offsetTop;
  const elementBottom = element.offsetTop + element.offsetHeight;

  const isStartedAboveCenter = elementTop < scrollCenter;
  const isEndingBelowCenter = elementBottom > scrollCenter;
  return isStartedAboveCenter && isEndingBelowCenter;
}