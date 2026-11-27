import { findByPath, type LinkedArtNode } from '@globalise/common';

export type RecordHierarchyNode = {
  key: string;
  record: LinkedArtNode;
  children: RecordHierarchyNode[];
};

export function buildRecordHierarchy(
  records: LinkedArtNode[],
): RecordHierarchyNode[] {
  const nodes = records.map((record, index): RecordHierarchyNode => ({
    key: record.id ?? `record-${index}`,
    record,
    children: [],
  }));
  const nodesById = new Map(
    nodes.flatMap((node) =>
      node.record.id ? [[node.record.id, node] as const] : [],
    ),
  );
  const parentByNode = new Map<RecordHierarchyNode, RecordHierarchyNode>();

  for (const node of nodes) {
    const parentId = findByPath(node.record, ['part_of']).find(
      (parent) => parent.id,
    )?.id;
    const parent = parentId ? nodesById.get(parentId) : undefined;
    if (parent && parent !== node) {
      parentByNode.set(node, parent);
    }
  }

  for (const [node, parent] of parentByNode) {
    const ancestors = new Set([node]);
    let current: RecordHierarchyNode | undefined = parent;
    while (current) {
      if (ancestors.has(current)) {
        parentByNode.delete(node);
        break;
      }
      ancestors.add(current);
      current = parentByNode.get(current);
    }
  }

  const roots: RecordHierarchyNode[] = [];
  for (const node of nodes) {
    const parent = parentByNode.get(node);
    if (parent) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}
