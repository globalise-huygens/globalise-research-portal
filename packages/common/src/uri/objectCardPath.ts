import { handle, idBase, matchUri } from './uriPatterns.ts';

export function createObjectCardPath(
  uri: string,
): string | null {
  const splat = createObjectCardSplat(uri);
  return splat && `/${handle}/${splat}`;
}

export function createObjectCardSplat(
  uri: string,
): string | null {
  const groups = matchUri('objectCard', uri);
  if (!groups) {
    return null;
  }
  const { type, id } = groups;
  return `${type}:${id}`;
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
