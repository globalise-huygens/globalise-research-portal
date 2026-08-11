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

export function getTimespan(node?: LinkedArtNode | null): Timespan | null {
  if (!node) {
    return null;
  }
  const timespan: Timespan = {
    beginOfTheBegin: getDate(node.begin_of_the_begin),
    endOfTheBegin: getDate(node.end_of_the_begin),
    beginOfTheEnd: getDate(node.begin_of_the_end),
    endOfTheEnd: getDate(node.end_of_the_end),
    label: getContent(findByPath(node, ['identified_by'])[0] ?? node),
  };
  return hasDates(timespan) ? timespan : null;
}

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
  if (!instant) {
    return null;
  }
  return {
    beginOfTheBegin: instant,
    endOfTheEnd: instant,
    label: dates[dates.length - 1],
  };
}

function getDate(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function hasDates(timespan: Timespan): boolean {
  return [
    timespan.beginOfTheBegin,
    timespan.endOfTheBegin,
    timespan.beginOfTheEnd,
    timespan.endOfTheEnd,
  ].some((date) => !!date);
}
