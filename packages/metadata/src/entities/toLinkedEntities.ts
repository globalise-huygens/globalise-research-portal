import {
  findByPath,
  getLinkedArtEntityType,
  orThrow,
  type LinkedArtNode,
} from '@globalise/common';
import type { LinkedEntity, Mention } from './EntityPanelModel.ts';

/**
 * Linked entities are embedded in the document metadata,
 * each with an annotation page of its mentions.
 */
export function toLinkedEntities(
  documentMetadata: LinkedArtNode,
): LinkedEntity[] {
  const path = ['carries', 'refers_to', 'member'];
  return findByPath(documentMetadata, path)
    .map(toLinkedEntity)
    .sort((a, b) => b.mentions.length - a.mentions.length);
}

function toLinkedEntity(entity: LinkedArtNode): LinkedEntity {
  const mentions = findByPath(entity, ['subject_of', 'items']);
  return {
    id: entity.id ?? orThrow('No entity id'),
    type: getLinkedArtEntityType(entity.id),
    label: entity._label ?? '',
    mentions: mentions.map(toMention),
  };
}

function toMention(item: LinkedArtNode): Mention {
  const [canvas] = findByPath(item, ['partOf']);
  return {
    annotationId: item.id ?? orThrow('No mention id'),
    canvasId: canvas?.id ?? orThrow('No mention canvas'),
  };
}
