import type { LinkedArtNode } from '@globalise/common';
import { mergePaths, type TreeNode } from '@globalise/common';
import { LinkedArtRelation } from './LinkedArtRelation.tsx';

export type HierarchyProps = {
  labelPaths: LinkedArtNode[][];
  currentNode: LinkedArtNode;
};

export function LabelHierarchy(
  { labelPaths, currentNode }: HierarchyProps,
) {
  return <LiHierarchy
    nodes={mergePaths(labelPaths.map((path) => [...path, currentNode]), getNodeKey)}
    depth={0}
    currentId={getNodeKey(currentNode)}
  />;
}

type LabelLiProps = {
  nodes: TreeNode<LinkedArtNode>[];
  depth: number;
  currentId: string;
};

function LiHierarchy({ nodes, depth, currentId }: LabelLiProps) {
  return (
    <ol className="metadata-hierarchy"
      data-depth={depth}>
      {nodes.map((node) => {
        const isLeaf = !node.children.length;
        const key = getNodeKey(node.item);
        const isCurrent = key === currentId;
        return (
          <li key={key} data-current={isCurrent}>
            {isCurrent ? (
              <span
                className="current"
              >
                <LinkedArtRelation node={node.item} />
              </span>
            ) : <LinkedArtRelation node={node.item} />}
            {!isLeaf && (
              <LiHierarchy
                nodes={node.children}
                depth={depth + 1}
                currentId={currentId}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function getNodeKey(node: LinkedArtNode): string {
  return node.id ?? JSON.stringify(node);
}
