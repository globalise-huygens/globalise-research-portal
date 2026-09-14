export type TreeNode<T> = {
  item: T;
  children: TreeNode<T>[];
};

/**
 * Try to create a tree from paths, merging nodes when the id and parent
 * match. When no overlap, multiple trees are returned.
 */
export function mergePaths<T>(
  paths: T[][],
  getId: (item: T) => string,
): TreeNode<T>[] {
  const roots: TreeNode<T>[] = [];
  for (const path of paths) {
    let siblings = roots;
    for (const item of path) {
      let node = siblings.find((sibling) => getId(sibling.item) === getId(item));
      if (!node) {
        node = { item, children: [] };
        siblings.push(node);
      }
      siblings = node.children;
    }
  }
  return roots;
}
