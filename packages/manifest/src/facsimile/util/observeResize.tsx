export function observeResize(
  element: HTMLElement,
  callback: (rect: DOMRect) => void,
) {
  const observer = new ResizeObserver((entries) => {
    callback(entries[0].contentRect);
  });
  observer.observe(element);
  return () => observer.disconnect();
}