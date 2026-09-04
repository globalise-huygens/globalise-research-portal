export function getSVGElement(svg: string) {
  if (typeof DOMParser === 'undefined') {
    throw new Error('SVG parsing is only available in a browser environment');
  }
  const svgDoc = new DOMParser().parseFromString(svg, 'image/svg+xml');
  return svgDoc.documentElement as unknown as SVGElement;
}
