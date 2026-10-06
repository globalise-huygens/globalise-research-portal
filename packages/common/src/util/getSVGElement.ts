export function getSVGElement(svg: string) {
  const svgDoc = new DOMParser().parseFromString(svg, 'image/svg+xml');
  return svgDoc.documentElement as unknown as SVGElement;
}
