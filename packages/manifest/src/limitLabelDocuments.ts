import type { ManifestDocument } from '@globalise/metadata';

export type LabelDocumentsLimit = {
  shown: ManifestDocument[];
  hidden: ManifestDocument[];
  hidesEdge: boolean;
};

export function limitLabelDocuments(
  edges: ManifestDocument[],
  others: ManifestDocument[],
  max: number,
): LabelDocumentsLimit {
  const documents = [...edges, ...others];
  return {
    shown: documents.slice(0, max),
    hidden: documents.slice(max),
    hidesEdge: edges.length > max,
  };
}
