import {
  asArray,
  findTimespan,
  getContent,
  getValue,
  getValues,
  isLinkedArtNode,
  type LinkedArtNode,
} from '@globalise/common';

export type PersonClaimValue = LinkedArtNode | string;

export function isPreferredPersonName(status: LinkedArtNode): boolean {
  return getStatusValues(status, ['classified_as']).some((value) =>
    isLinkedArtNode(value)
      && value.id === 'https://data.globalise.huygens.knaw.nl/hdl:20.500.14722/thesaurus:31baab68-ad9e-4eb4-baba-0c4b163fc00c',
  );
}

export function getStatusValues(node: LinkedArtNode, keys: string[]): PersonClaimValue[] {
  for (const key of keys) {
    const values = asArray(node[key]).flatMap<PersonClaimValue>((value) =>
      isLinkedArtNode(value) && !('@value' in value)
        ? [value]
        : getValues(value),
    );
    if (values.length) {
      return values;
    }
  }
  return [];
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

export function uniqueClaimValues(values: PersonClaimValue[]): PersonClaimValue[] {
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

const dateProperties = [
  'begin_of_the_begin',
  'end_of_the_begin',
  'begin_of_the_end',
  'end_of_the_end',
] as const;

function getDateValues(timespan: LinkedArtNode, key: typeof dateProperties[number]) {
  return getValues(timespan[key] ?? (key === 'end_of_the_end'
    ? timespan['crm:P82b_end_of_the_end']
    : undefined));
}

export function getPersonTimespan(node: LinkedArtNode) {
  if (isLinkedArtNode(node.timespan)) {
    const timespan = node.timespan;
    const dates = dateProperties.map((key) => getDateValues(timespan, key));
    if (dates.some((values) => new Set(values.map(formatRecordedDate)).size > 1)) {
      return null;
    }
    return findTimespan({
      ...node,
      timespan: {
        ...node.timespan,
        ...Object.fromEntries(dateProperties.map((key, index) => [key, dates[index][0]])),
      },
    });
  }
  const dates = getValues(node['crm:P4_has_time-span']);
  if (new Set(dates.map(formatRecordedDate)).size > 1) {
    return null;
  }
  return findTimespan(node);
}

export type RecordedDates = {
  starts: string[];
  ends: string[];
  dates: string[];
};

export function getRecordedDates(node: LinkedArtNode): RecordedDates | null {
  const timespan = isLinkedArtNode(node.timespan) ? node.timespan : undefined;
  const starts = timespan ? uniqueDates([
    ...getDateValues(timespan, 'begin_of_the_begin'),
    ...getDateValues(timespan, 'end_of_the_begin'),
  ]) : [];
  const ends = timespan ? uniqueDates([
    ...getDateValues(timespan, 'begin_of_the_end'),
    ...getDateValues(timespan, 'end_of_the_end'),
  ]) : [];
  const dates = uniqueDates(getValues(node['crm:P4_has_time-span']));
  return starts.length || ends.length || dates.length ? { starts, ends, dates } : null;
}

export function formatRecordedDate(date: string): string {
  return date.replace(/T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?/g, '');
}

function uniqueDates(dates: string[]): string[] {
  return [...new Set(dates.map(formatRecordedDate))];
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
