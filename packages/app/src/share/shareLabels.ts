import type { ManifestRouteType } from './ManifestRoute';

export const shareLabels: Record<ManifestRouteType, string> = {
  inventory: 'Copy link to this inventory',
  scan: 'Copy link to this scan',
  document: 'Copy link to this document',
  hit: 'Copy link to this search hit',
};
