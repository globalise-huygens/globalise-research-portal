const highlightName = 'content-query';

/**
 * Highlight client search query hits
 */
export function highlightClientSearchQuery(
  element: HTMLElement,
  query: string,
): Range[] {
  const words = query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  const textNodes = findTextNodes(element);
  const hitRanges = textNodes
    .flatMap((node) => words.flatMap((word) => findHitRanges(node, word)));
  CSS.highlights.set(highlightName, new Highlight(...hitRanges));
  return hitRanges;
}

export function clearClientSearchQueryHighlight(): void {
  CSS.highlights.delete(highlightName);
}

function findTextNodes(root: HTMLElement): Node[] {
  const textNodes: Node[] = [];
  const treeWalker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  while (treeWalker.nextNode()) {
    textNodes.push(treeWalker.currentNode);
  }
  return textNodes;
}

function findHitRanges(node: Node, word: string): Range[] {
  const text = node.textContent?.toLowerCase() ?? '';
  const ranges: Range[] = [];
  let hitStartIndex = text.indexOf(word);
  while (hitStartIndex !== -1) {
    const endIndex = hitStartIndex + word.length;
    const hitRange = createRange(node, hitStartIndex, endIndex);
    ranges.push(hitRange);
    hitStartIndex = text.indexOf(word, endIndex);
  }
  return ranges;
}

function createRange(
  node: Node,
  start: number,
  end: number,
): Range {
  const range = document.createRange();
  range.setStart(node, start);
  range.setEnd(node, end);
  return range;
}
