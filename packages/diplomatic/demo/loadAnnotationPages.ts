import type { EmbeddedCanvasAnnotationPage } from '@globalise/common/annotation';

export const canvasId =
  'https://data.globalise.huygens.knaw.nl/manifests/NL-HaNA_1.04.02_3598_0797/canvas/p1';

export const annotationUrls = [
  '/NL-HaNA_1.04.02_3598_0797-transcription.json',
  '/NL-HaNA_1.04.02_3598_0797-entities.json',
];
export const scanUrl = '/NL-HaNA_1.04.02_3598_0797.jpg';

export async function loadAnnotationPages(): Promise<EmbeddedCanvasAnnotationPage[]> {
  const pages: EmbeddedCanvasAnnotationPage[] = [];
  for (const url of annotationUrls) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Could not load ${url}: ${response.status}`);
    }
    const json = await response.json() as EmbeddedCanvasAnnotationPage | EmbeddedCanvasAnnotationPage[];
    pages.push(...(Array.isArray(json) ? json : [json]));
  }
  return pages;
}