import { handle, idBase, matchUri } from './uriPatterns.ts';

export function createObjectCardPath(
  uri: string,
): string {
  return `/${handle}/${createObjectCardSplat(uri)}`;
}

export function createObjectCardSplat(
  uri: string,
): string {
  return uri.slice(`${idBase}/`.length);
}

export function parseObjectCardSplat(
  splat: string,
): string | null {
  const groups = matchUri('objectCardSplat', splat);
  if (!groups) {
    return null;
  }
  const { type, id } = groups;
  return `${idBase}/${type}:${id}`;
}
