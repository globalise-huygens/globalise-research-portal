import {
  getStatusValues,
  type LinkedArtNode,
  type StatusValue,
} from '@globalise/common';

export type PlaceRelationship = {
  targets: StatusValue[];
  types: StatusValue[];
  statements: string[];
  isCombined: boolean;
};

export function getPlaceRelationship(
  record: LinkedArtNode,
  classifications: StatusValue[],
): PlaceRelationship | undefined {
  const targetKey = relationshipTargetKeys.get(record.type);
  if (!targetKey) {
    return undefined;
  }
  const targets = getStatusValues(record, [targetKey]);
  const types = getRelationshipTypes(record, classifications);
  const isCombined = record.type === 'TopographicalStatus'
    && types.length > 1 && targets.length > 1;
  const statements = isCombined ? getRecordedStatements(record) : [];
  return { targets, types, statements, isCombined };
}

const relationshipTargetKeys = new Map([
  ['TopographicalStatus', 'ascribes_place'],
  ['SimilarityStatus', 'ascribes_similarity_target'],
]);

function getRelationshipTypes(
  record: LinkedArtNode,
  classifications: StatusValue[],
): StatusValue[] {
  if (record.type === 'SimilarityStatus') {
    return getStatusValues(record, ['ascribes_similarity_relation']);
  }
  if (classifications.length) {
    return classifications;
  }
  return getStatusValues(record, ['ascribes_topographical_relation']);
}

function getRecordedStatements(record: LinkedArtNode): string[] {
  const labels: unknown[] = Array.isArray(record._label)
    ? record._label
    : [record._label];
  return labels.filter((value): value is string => typeof value === 'string');
}
