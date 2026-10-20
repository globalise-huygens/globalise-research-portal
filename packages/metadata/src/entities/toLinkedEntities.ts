import { findByPath, orThrow, type LinkedArtNode } from '@globalise/common';
import type { LinkedEntity, Mention } from './EntityPanelModel.ts';

/**
 * Linked entities are embedded in the document record,
 * each with an annotation page of its mentions.
 */
export function toLinkedEntities(record: LinkedArtNode): LinkedEntity[] {
  return findByPath(record, ['carries', 'refers_to', 'member']).map((entity) => ({
    id: entity.id ?? orThrow('No entity id'),
    type: entity.type,
    label: entity._label ?? '',
    mentions: findByPath(entity, ['subject_of', 'items']).map(toMention),
  }));
}

function toMention(item: LinkedArtNode): Mention {
  const [canvas] = findByPath(item, ['partOf']);
  return {
    annotationId: item.id ?? orThrow('No mention id'),
    canvasId: canvas?.id ?? orThrow('No mention canvas'),
  };
}
