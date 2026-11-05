import {
  findByPath,
  LinkedArtNode,
  useMetadataNodes, useMetadataRoot,
} from '@globalise/common';
import { LabelHierarchy } from '../common';
import type { FieldProps } from './FieldProps';

export function MemberOfField({ url, path = ['member_of'] }: FieldProps) {
  const root = useMetadataRoot(url);
  const labelPaths = useMetadataNodes(url, path).flatMap((node) => toParentNodes(node));

  if (!root || !labelPaths.length) {
    return null;
  }
  return (
    <LabelHierarchy
      labelPaths={labelPaths}
      currentNode={root}
    />
  );
}

function toParentNodes(
  node: LinkedArtNode,
  visited = new Set<string>(),
): LinkedArtNode[][] {
  const key = getNodeKey(node);
  if (visited.has(key)) {
    return [[node]];
  }
  const nextVisited = new Set(visited).add(key);
  const parents = findByPath(node, ['member_of']);
  if (!parents.length) {
    return [[node]];
  }
  return parents.flatMap(
    (parent) => toParentNodes(parent, nextVisited).map((path) => [...path, node]),
  );
}

function getNodeKey(node: LinkedArtNode): string {
  return node.id ?? JSON.stringify(node);
}