import type { ShareLink } from '@globalise/manifest';
import type { SharableRouteState } from './collectSharableRouteState';
import { createSharableHref } from './createSharableHref';

export function createShareLink(
  route: SharableRouteState,
  origin: string,
  label: string,
): ShareLink {
  return {
    href: new URL(createSharableHref(route), origin).href,
    label,
  };
}
