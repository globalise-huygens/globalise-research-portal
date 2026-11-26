import { matchUri } from './uriPatterns.ts';

export function isInternalUri(uri?: string): boolean {
  return uri !== undefined && matchUri('internal', uri) !== undefined;
}
