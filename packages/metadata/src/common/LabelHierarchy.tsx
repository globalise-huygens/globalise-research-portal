export type HierarchyProps = {
  labelPaths: string[][];
  currentLabel: string;
};

type LabelNode = {
  label: string;
  children: LabelNode[];
};

export function LabelHierarchy(
  { labelPaths, currentLabel }: HierarchyProps,
) {
  return <LiHierarchy
    nodes={toHierarchy(labelPaths)} 
    current={currentLabel} depth={0} 
  />;
}

/**
 * Try to create a tree from paths, merging nodes when label and parent match
 * When no overlap, multiple trees are returned.
 */
export function toHierarchy(
  labelPaths: string[][],
): LabelNode[] {
  const roots: LabelNode[] = [];
  for (const labelPath of labelPaths) {
    let siblings = roots;
    for (const label of labelPath) {
      let node = siblings.find((sibling) => sibling.label === label);
      if (!node) {
        node = { label, children: [] };
        siblings.push(node);
      }
      siblings = node.children;
    }
  }
  return roots;
}

type LabelLiProps = {
  nodes: LabelNode[];
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
          <li key={node.label} data-current={isLeaf}>
            {isLeaf && (
              <span
                data-slot="current"
              >
                {current}
              </span>
            )}
            {node.label}
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
