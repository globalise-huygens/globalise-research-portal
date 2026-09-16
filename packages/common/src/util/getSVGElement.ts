const parser = new DOMParser();

export function getSVGElement(svg: string) {
  const svgDoc = parser.parseFromString(svg, 'image/svg+xml');
  return svgDoc.documentElement as unknown as SVGElement;
}
