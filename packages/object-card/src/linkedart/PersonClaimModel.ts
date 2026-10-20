import {
  asArray,
  findByPath,
  getContent,
  getValue,
  getStatusValues,
  getValues,
  isLinkedArtNode,
  label,
  type LinkedArtNode,
  type StatusValue,
} from '@globalise/common';

export function isPreferredPersonName(status: LinkedArtNode): boolean {
  return getStatusValues(status, ['classified_as']).some((value) =>
    isLinkedArtNode(value)
      && value.id === 'https://data.globalise.huygens.knaw.nl/hdl:20.500.14722/thesaurus:31baab68-ad9e-4eb4-baba-0c4b163fc00c',
  );
}

export function getPersonNameRecords(entity: LinkedArtNode) {
  return findByPath(entity, ['is_appellative_subject_of'])
    .filter((status) => status.type === 'AppellativeStatus')
    .flatMap((status, statusIndex) =>
      getStatusValues(status, ['ascribes_appellation', 'aaao:ZP6_ascribes_appellation'])
        .map((value, valueIndex) => ({
          key: `${status.id ?? statusIndex}-${valueIndex}`,
          name: typeof value === 'string' ? value
            : getContent(value) || getValue(value.value) || (value.type === 'Type' ? label(value) : ''),
          status,
        })),
    )
    .filter((record) => !!record.name);
}

export function sortPersonNames<T extends { name: string; status: LinkedArtNode }>(records: T[]): T[] {
  return [...records].sort((left, right) =>
    Number(isPreferredPersonName(right.status)) - Number(isPreferredPersonName(left.status)),
  );
}

function valueKey(value: unknown): string {
  if (isLinkedArtNode(value)) {
    return value.id ?? JSON.stringify([
      value.type,
      getContent(value) || getValue(value.value) || getValue(value._label),
    ]);
  }
  return JSON.stringify(getValues(value));
}

export function uniqueClaimValues(values: StatusValue[]): StatusValue[] {
  return [...new Map(values.map((value) => [valueKey(value), value])).values()];
}

// Dates and evidence remain on each record; only equivalent claims share a row.
export function groupPersonClaims(records: LinkedArtNode[]) {
  return groupRecords(records, (record, index) => JSON.stringify([
    // Missing occupations do not establish equivalent claims, even if the
    // remaining fields match. Keep their evidence on separate rows.
    record.type === 'SocialStatus' && !getStatusValues(record, ['ascribes_social_status']).length
      ? index
      : null,
    Object.keys(record)
      .filter((key) => key.includes('ascribes_')
        || key === 'classified_as'
        || key === 'has_geographic_scope')
      .sort()
      .map((key) => [key, asArray(record[key]).map(valueKey).sort()]),
  ]));
}

export function groupRecords<T>(records: T[], keyFor: (record: T, index: number) => string) {
  const groups = new Map<string, { key: string; records: T[] }>();
  for (const [index, record] of records.entries()) {
    const key = keyFor(record, index);
    const group = groups.get(key);
    if (group) {
      group.records.push(record);
    } else {
      groups.set(key, { key, records: [record] });
    }
  }
  return [...groups.values()];
}

export function getResidenceLabel(values: string[]): string | undefined {
  if (values.length !== 1) {
    return undefined;
  }
  const text = values[0]
    .replaceAll('_', ' ').toLowerCase();
  if (['origin', 'place of origin'].includes(text)) {
    return 'Origin';
  }
  if (['residence', 'residency', 'place of residence'].includes(text)) {
    return 'Residence';
  }
  return undefined;
}
