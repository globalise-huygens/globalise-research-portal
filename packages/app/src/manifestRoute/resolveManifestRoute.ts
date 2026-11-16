import { type DocumentRef, createViewerPath, parseViewerPath } from '@globalise/common/uri';

export type ResolvedManifestRoute = {
  document: DocumentRef;
  canvasPath: string;
};

export function resolveManifestRoute(
  path: string,
): ResolvedManifestRoute | undefined {
  const ref = parseViewerPath(path);
  if (ref && 'endPage' in ref) {
    return resolveManifestDocumentRoute(ref);
  }
  return undefined;
}

function resolveManifestDocumentRoute(
  document: DocumentRef,
): ResolvedManifestRoute {
  const { inventory, page } = document;
  return { document, canvasPath: createViewerPath({ inventory, page }) };
}
