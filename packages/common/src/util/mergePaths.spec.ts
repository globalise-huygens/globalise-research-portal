import { describe, expect, it } from 'vitest';
import { mergePaths } from './mergePaths.ts';

describe(mergePaths.name, () => {
  it('merges two paths', () => {
    const [tree, ...rest] = mergePaths([['a', 'b1'], ['a', 'b2']], (id) => id);
    expect(rest).toEqual([]);
    expect(tree.item).toBe('a');
    expect(tree.children.map((child) => child.item)).toEqual(['b1', 'b2']);
  });
});
