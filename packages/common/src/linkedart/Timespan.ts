import { LinkedArtNode } from './LinkedArtNode.ts';
import { isLinkedArtNode } from './isLinkedArtNode.ts';
import { findByPath } from './findByPath.ts';
import { getContent } from './getContent.ts';
import { getValues } from './LinkedArtValue.ts';

export type Timespan = {
  beginOfTheBegin?: string;
  endOfTheBegin?: string;
  beginOfTheEnd?: string;
  endOfTheEnd?: string;
  label?: string;
};

export type RecordedDates = {
  starts: string[];
  ends: string[];
  dates: string[];
};

export function findTimespan(node?: LinkedArtNode | null): Timespan | null {
  if (!node) {
    return null;
  }
  const nested = getTimespan(
    isLinkedArtNode(node.timespan) ? node.timespan : null,
  );
  if (nested) {
    return nested;
  }
  const dates = getValues(node['crm:P4_has_time-span']);
  const [instant] = dates;
  if (!instant || uniqueDates(dates).length > 1) {
    return null;
  }
  return {
    beginOfTheBegin: instant,
    endOfTheEnd: instant,
    label: dates[dates.length - 1],
  };
}

export function getTimespan(node?: LinkedArtNode | null): Timespan | null {
  if (!node) {
    return null;
  }
  if (dateProperties.some((key) => uniqueDates(getDateValues(node, key)).length > 1)) {
    return null;
  }
  const timespan: Timespan = {
    beginOfTheBegin: getDateString(node.begin_of_the_begin),
    endOfTheBegin: getDateString(node.end_of_the_begin),
    beginOfTheEnd: getDateString(node.begin_of_the_end),
    endOfTheEnd: getDateString(node.end_of_the_end ?? node['crm:P82b_end_of_the_end']),
    label: getContent(findByPath(node, ['identified_by'])[0] ?? node),
  };
  return hasDates(timespan) ? timespan : null;
}

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

function getDateString(value: unknown): string | undefined {
  return getValues(value)[0];
}

function hasDates(timespan: Timespan): boolean {
  return [
    timespan.beginOfTheBegin,
    timespan.endOfTheBegin,
    timespan.beginOfTheEnd,
    timespan.endOfTheEnd,
  ].some((date) => !!date);
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

function uniqueDates(dates: string[]): string[] {
  return [...new Set(dates.map(formatRecordedDate))];
}
