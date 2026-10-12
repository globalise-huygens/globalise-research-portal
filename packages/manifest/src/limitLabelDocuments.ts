import type { ManifestDocument } from '@globalise/metadata';

export type LabelDocumentsLimit = {
  shown: ManifestDocument[];
  hidden: ManifestDocument[];
  hidesBoundary: boolean;
};

export function limitLabelDocuments(
  boundaries: ManifestDocument[],
  others: ManifestDocument[],
  max: number,
): LabelDocumentsLimit {
  const documents = [...boundaries, ...others];
  return {
    shown: documents.slice(0, max),
    hidden: documents.slice(max),
    hidesBoundary: boundaries.length > max,
  };
}
