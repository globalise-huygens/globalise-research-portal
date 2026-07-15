import {
  findByPath,
  label,
  LinkedArtNode,
  useMetadataNodes, useMetadataRoot,
} from '@globalise/common';
import { LabelHierarchy } from '../common';

export function MemberOfField() {
  const root = useMetadataRoot();
  const labelPaths = useMetadataNodes(['member_of']).flatMap(toParentLabels);

  if (!root || !labelPaths.length) {
    return null;
  }
  return (
    <LabelHierarchy
      labelPaths={labelPaths}
      currentLabel={label(root)}
    />
  );
}

/**
 * A set can be a member of more than one set,
 * and so can yield more than one path of parent labels.
 */
function toParentLabels(node: LinkedArtNode): string[][] {
  const parents = findByPath(node, ['member_of']);
  if (!parents.length) {
    return [[label(node)]];
  }
  return parents.flatMap(
    (parent) => toParentLabels(parent).map((path) => [...path, label(node)]),
  );
}
