import type { ShareLink } from '@globalise/manifest';
import type { ManifestRoute } from './ManifestRoute';
import { createSharableHref } from './createSharableHref';

export function createShareLink(
  route: ManifestRoute,
  origin: string,
  label: string,
): ShareLink {
  return {
    href: new URL(createSharableHref(route), origin).href,
    label,
  };
}
