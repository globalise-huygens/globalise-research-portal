import { mergePaths, type TreeNode } from '@globalise/common';

export type HierarchyProps = {
  labelPaths: string[][];
  currentLabel: string;
};

export function LabelHierarchy(
  { labelPaths, currentLabel }: HierarchyProps,
) {
  return <LiHierarchy
    nodes={mergePaths(labelPaths, (label) => label)}
    current={currentLabel} depth={0}
  />;
}

type LabelLiProps = {
  nodes: TreeNode<string>[];
  current: string;
  depth: number;
};

function LiHierarchy({ nodes, current, depth }: LabelLiProps) {
  return (
    <ol className="metadata-hierarchy"
      data-depth={depth}>
      {nodes.map((node) => {
        const isLeaf = !node.children.length;
        return (
          <li key={node.item} data-current={isLeaf}>
            {isLeaf && (
              <span
                className="current"
              >
                {current}
              </span>
            )}
            {node.item}
            {!isLeaf && (
              <LiHierarchy
                nodes={node.children}
                current={current}
                depth={depth + 1}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
