import { type ViewerRef, createViewerPath, parseCanvasId, parseManifestId } from '@globalise/common/uri';
import { stringifyUrlParams } from '../params/urlParams.ts';
import type { ManifestUrlParams } from '../params/manifestUrlParams.ts';

const defaultInventory = { inventory: '1053' };

export function toViewerHref(
  ref: ViewerRef,
  search: ManifestUrlParams,
): string {
  return `${createViewerPath(ref)}${stringifyUrlParams(search)}`;
}

export function toCanvasHref(
  canvasId: string,
  search: ManifestUrlParams,
): string | undefined {
  const page = parseCanvasId(canvasId);
  return page && toViewerHref(page, search);
}

export function findViewerPath(
  { manifest, canvas }: ManifestUrlParams,
): string {
  const page = canvas ? parseCanvasId(canvas) : undefined;
  const inventory = manifest ? parseManifestId(manifest) : undefined;
  return createViewerPath(page ?? inventory ?? defaultInventory);
}
