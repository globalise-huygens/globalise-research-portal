import { mergePaths, type TreeNode } from '@globalise/common';

export type HierarchyProps = {
  labelPaths: string[][];
  currentLabel: string;
};

export function LabelHierarchy(
  { labelPaths, currentLabel }: HierarchyProps,
) {
  return <LiHierarchy
    nodes={mergePaths(labelPaths.map((path) => [...path, currentLabel]), (label) => label)}
    depth={0}
  />;
}

type LabelLiProps = {
  nodes: TreeNode<string>[];
  depth: number;
};

function LiHierarchy({ nodes, depth }: LabelLiProps) {
  return (
    <ol className="metadata-hierarchy"
      data-depth={depth}>
      {nodes.map((node) => {
        const isLeaf = !node.children.length;
        return (
          <li key={node.item} data-current={isLeaf}>
            {isLeaf ? (
              <span
                className="current"
              >
                {node.item}
              </span>
            ) : node.item}
            {!isLeaf && (
              <LiHierarchy
                nodes={node.children}
                depth={depth + 1}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
