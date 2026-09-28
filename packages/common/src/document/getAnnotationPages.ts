import type { Vault } from '@iiif/helpers/vault';
import type { CanvasNormalized } from '@iiif/presentation-3-normalized';
import type { CanvasAnnotationPage } from '../annotation';

export function getAnnotationPages(
  vault: Vault,
  canvas: CanvasNormalized,
): CanvasAnnotationPage[] {
  return canvas.annotations
    .filter((page) => page.type === 'AnnotationPage')
    .map((page) => vault.toPresentation3<CanvasAnnotationPage>(page));
}
