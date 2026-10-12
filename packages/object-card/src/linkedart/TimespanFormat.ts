import type { Timespan } from '@globalise/common';
import { formatRecordedDate } from './PersonClaimModel.ts';

export function formatTimespanBoundaries(timespan: Timespan): string[] {
  return [
    ['Earliest start', timespan.beginOfTheBegin],
    ['Latest start', timespan.endOfTheBegin],
    ['Earliest end', timespan.beginOfTheEnd],
    ['Latest end', timespan.endOfTheEnd],
  ].map(([label, date]) => `${label}: ${date ? formatRecordedDate(date) : 'not recorded'}`);
}

export function formatDateRange(earliest?: string, latest?: string, abbreviateYear = true): string | undefined {
  const start = earliest && formatRecordedDate(earliest);
  const end = latest && formatRecordedDate(latest);
  if (!start && !end) {
    return undefined;
  }
  if (start === end) {
    return start;
  }
  if (!start) {
    return `on or before ${end}`;
  }
  if (!end) {
    return `on or after ${start}`;
  }
  const year = /^(\d{4})-01-01$/.exec(start)?.[1];
  if (abbreviateYear && year && end === `${year}-12-31`) {
    return year;
  }
  return `between ${start} and ${end}`;
}

export function formatTimespanSummary(timespan: Timespan): string[] {
  return [
    `Start: ${formatDateRange(timespan.beginOfTheBegin, timespan.endOfTheBegin, false) ?? 'not recorded'}`,
    `End: ${formatDateRange(timespan.beginOfTheEnd, timespan.endOfTheEnd, false) ?? 'not recorded'}`,
  ];
}

export function formatTimespan(timespan: Timespan, event = false): string[] {
  if (event) {
    const date = formatDateRange(
      timespan.beginOfTheBegin ?? timespan.beginOfTheEnd,
      timespan.endOfTheEnd ?? timespan.endOfTheBegin,
    );
    return date ? [date] : [];
  }
  if (timespan.endOfTheBegin || timespan.beginOfTheEnd) {
    return [
      `Start: ${formatDateRange(timespan.beginOfTheBegin, timespan.endOfTheBegin) ?? 'not recorded'}`,
      `End: ${formatDateRange(timespan.beginOfTheEnd, timespan.endOfTheEnd) ?? 'not recorded'}`,
    ];
  }
  if (timespan.label) {
    return [formatRecordedDate(timespan.label)];
  }
  const dates = [...new Set([timespan.beginOfTheBegin, timespan.endOfTheEnd]
    .filter((date): date is string => !!date).map(formatRecordedDate))];
  return [dates.join(' – ')];
}
