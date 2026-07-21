export function isCentered(container: HTMLElement, element: HTMLElement): boolean {
  const scrollTop = container.scrollTop;
  const clientHeight = container.clientHeight;
  const scrollCenter = scrollTop + clientHeight / 2;

  const elementTop = element.offsetTop;
  const elementBottom = element.offsetTop + element.offsetHeight;

  return elementTop < scrollCenter && elementBottom > scrollCenter;
}