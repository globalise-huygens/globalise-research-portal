import { findByPath, getContent, getLinkedArtEntityType, getValue, getValues, type LinkedArtNode } from '@globalise/common';
import type { EntityPreviewCardData, EntityPreviewCardProperty, EntityPreviewCardType } from '@globalise/design';
import { getPersonNameRecords, getPersonTimespan } from './PersonClaimModel.ts';
import { getRelationValue, getResolvedRelationValue } from './RelationValueModel.ts';
import { formatTimespan } from './TimespanFormat.ts';

// Preview only explicit details in the resolved record. A label alone adds no information.
export function getResourcePreview(resource: LinkedArtNode, uri: string): EntityPreviewCardData | undefined {
  const title = getResolvedRelationValue(resource) ?? getRelationValue(resource);
  const properties: EntityPreviewCardProperty[] = [];
  const definition = getValue(resource.definition).trim();
  if (definition) {
    properties.push({ label: 'Definition', value: definition });
  }
  const names = [...new Set([
    ...getValues(resource.altLabel),
    ...findByPath(resource, ['identified_by']).filter((name) => name.type === 'Name').map(getContent),
    ...getPersonNameRecords(resource).map((record) => record.name),
  ].map((name) => name.trim()).filter((name) => name && name !== title))];
  if (names.length) {
    properties.push({ label: 'Also called', value: names.join(', ') });
  }
  for (const [key, label] of [['born', 'Born'], ['died', 'Died']] as const) {
    const dates = findByPath(resource, [key]).flatMap((event) => {
      const timespan = getPersonTimespan(event);
      return timespan ? formatTimespan(timespan, true) : [];
    });
    if (dates.length) {
      properties.push({ label, value: [...new Set(dates)].join('; ') });
    }
  }
  return properties.length ? { type: previewType(resource, uri), title, properties } : undefined;
}

function previewType(resource: LinkedArtNode, uri: string): EntityPreviewCardType {
  if (resource.type === 'Concept' || resource.type === 'Type' || resource.prefLabel) {
    return 'concept';
  }
  switch (getLinkedArtEntityType(uri)) {
    case 'person': return 'person';
    case 'place': return 'place';
    case 'organization': return 'organisation';
    case 'ship': return 'ship';
    case 'polity': return 'polity';
    case 'conceptscheme':
    case 'collection': return 'concept';
    default: return 'entity';
  }
}
