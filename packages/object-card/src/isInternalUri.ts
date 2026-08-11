const internalHost = 'data.globalise.huygens.knaw.nl';

/**
 * Can we open this uri as an object card ourselves,
 * or does it belong to an external vocabulary?
 */
export function isInternalUri(uri?: string): boolean {
  if (!uri) {
    return false;
  }
  try {
    return new URL(uri).hostname === internalHost;
  } catch {
    return false;
  }
}
