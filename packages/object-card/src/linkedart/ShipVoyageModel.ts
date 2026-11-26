import { findByPath, type LinkedArtNode } from '@globalise/common';

export type VoyageHierarchyNode = {
  key: string;
  voyage: LinkedArtNode;
  children: VoyageHierarchyNode[];
};

export function buildVoyageHierarchy(
  voyages: LinkedArtNode[],
): VoyageHierarchyNode[] {
  const nodes = voyages.map((voyage, index): VoyageHierarchyNode => ({
    key: voyage.id ?? `voyage-${index}`,
    voyage,
    children: [],
  }));
  const nodesById = new Map(
    nodes.flatMap((node) =>
      node.voyage.id ? [[node.voyage.id, node] as const] : [],
    ),
  );
  const parentByNode = new Map<VoyageHierarchyNode, VoyageHierarchyNode>();

  for (const node of nodes) {
    const parentId = findByPath(node.voyage, ['part_of']).find(
      (parent) => parent.id,
    )?.id;
    const parent = parentId ? nodesById.get(parentId) : undefined;
    if (parent && parent !== node) {
      parentByNode.set(node, parent);
    }
  }

  for (const [node, parent] of parentByNode) {
    const ancestors = new Set([node]);
    let current: VoyageHierarchyNode | undefined = parent;
    while (current) {
      if (ancestors.has(current)) {
        parentByNode.delete(node);
        break;
      }
      ancestors.add(current);
      current = parentByNode.get(current);
    }
  }

  const roots: VoyageHierarchyNode[] = [];
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
