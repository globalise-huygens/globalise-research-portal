import { findByPath, getContent, getLinkedArtEntityType, getValue, getValues, type LinkedArtNode } from '@globalise/common';
import type { EntityPreviewCardData, EntityPreviewCardProperty, EntityPreviewCardType } from '@globalise/design';
import { getPersonNameRecords, getPersonTimespan } from './PersonClaimModel.ts';
import { getRelationValue, getResolvedRelationValue } from './RelationValueModel.ts';
import { formatTimespan } from './TimespanFormat.ts';
import { createElement, type ReactNode } from 'react';
import { EntityIcon } from '@globalise/design';
import { isInternalUri } from '../isInternalUri.ts';

export function getResourcePreview(resource: LinkedArtNode, uri: string, renderRelations?: (nodes: LinkedArtNode[]) => ReactNode): EntityPreviewCardData {
  const title = getResolvedRelationValue(resource) ?? getRelationValue(resource);
  const type = previewType(resource, uri);
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
    properties.push({ label: type === 'person' ? 'Also called' : 'Alt label', value: names.join(', ') });
  }
  if (type === 'concept' && renderRelations) {
    for (const [key, label] of [['inScheme', 'Scheme'], ['broader', 'Broader']] as const) {
      const nodes = findByPath(resource, [key]);
      if (nodes.length) {properties.push({ label, value: renderRelations(nodes) });}
    }
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
  return {
    type, title, properties, icon: createElement(EntityIcon, { type }),
    openFullCardHref: isInternalUri(uri) ? `/object-card?${new URLSearchParams({ uri })}` : uri,
    openFullCardLabel: isInternalUri(uri) ? `Open ${title} in a full object card` : `Open ${title}`,
  };
}

function previewType(resource: LinkedArtNode, uri: string): EntityPreviewCardType {
  if (resource.type === 'Concept' || resource.type === 'Type') {
    return 'concept';
  }
  switch (getLinkedArtEntityType(uri)) {
    case 'person': return 'person';
    case 'place': return 'place';
    case 'organization': return 'organisation';
    case 'ship': return 'ship';
    case 'polity': return 'polity';
    case 'conceptscheme':
    case 'concept':
    case 'collection': return 'concept';
    default: return resource.prefLabel ? 'concept' : 'entity';
  }
}
