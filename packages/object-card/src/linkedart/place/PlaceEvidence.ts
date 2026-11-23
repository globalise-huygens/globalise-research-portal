import { findByPath, getContent, type LinkedArtNode } from '@globalise/common';
import { getNotes, isVisibleSource } from '../SourceList.tsx';

export function getPlaceEvidence(node: LinkedArtNode) {
  const references = findByPath(node, ['referred_to_by']);
  const remarks = references.filter(isPlaceRemark);
  const citations = references.filter((reference) =>
    !remarks.includes(reference));
  const remarkCitations = remarks.flatMap((remark) =>
    findByPath(remark, ['referred_to_by']));
  const remarkNotes = remarks.map(getContent).filter(Boolean);
  const notes = [...new Set([...getNotes(node), ...remarkNotes])];
  const sources = [...citations, ...remarkCitations]
    .filter((source) => isVisibleSource(source));
  const uniqueSources = new Map(
    sources.map((source) => [JSON.stringify(source), source]),
  );
  return { notes, sources: [...uniqueSources.values()] };
}

function isPlaceRemark(reference: LinkedArtNode): boolean {
  const classifications = findByPath(reference, ['classified_as']);
  return classifications.some((type) =>
    type.id === 'http://vocab.getty.edu/aat/300435415');
}
