import { LinkedArtNode } from './LinkedArtNode.ts';
import { findByPath } from './findByPath.ts';
import { label } from './label.ts';
import { getContent } from './getContent.ts';
import { findTimespan, Timespan } from './timespan.ts';

const relationSuffix = '_relation';
const ascribesPrefix = 'ascribes_';

export type Status = {
  ascribed: LinkedArtNode[];
  relation: LinkedArtNode[];
  scope: LinkedArtNode[];
  timespan: Timespan | null;
  sources: LinkedArtNode[];
  label: string;
};

export function findStatuses(node: LinkedArtNode, key: string): Status[] {
  return findByPath(node, [key]).map(getStatus);
}

export function getStatusLabel(status: Status): string {
  const ascribed = status.ascribed
    .map((node) => getContent(node) || label(node))
    .filter((found) => !!found);
  if (!ascribed.length) {
    return status.label;
  }
  return ascribed.join(', ');
}

function getStatus(node: LinkedArtNode): Status {
  return {
    ascribed: findAscribed(node, (key) => !key.endsWith(relationSuffix)),
    relation: findAscribed(node, (key) => key.endsWith(relationSuffix)),
    scope: findByPath(node, ['has_geographic_scope']),
    timespan: findTimespan(node),
    sources: findByPath(node, ['referred_to_by']),
    label: label(node),
  };
}

function findAscribed(
  node: LinkedArtNode,
  matches: (key: string) => boolean,
): LinkedArtNode[] {
  return Object.keys(node)
    .filter((key) => key.startsWith(ascribesPrefix) && matches(key))
    .flatMap((key) => findByPath(node, [key]));
}
