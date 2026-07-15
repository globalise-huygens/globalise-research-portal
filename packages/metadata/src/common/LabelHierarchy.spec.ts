import { describe, expect, it } from 'vitest';
import { LabelHierarchy, toHierarchy } from './LabelHierarchy.tsx';

describe(LabelHierarchy.name, () => {
  describe(toHierarchy.name, () => {
    it('merges two paths', () => {
      const [tree, ...rest] = toHierarchy([['a', 'b1'], ['a', 'b2']]);
      expect(rest).toEqual([]);
      expect(tree.label).toBe('a');
      expect(tree.children.map((child) => child.label)).toEqual(['b1', 'b2']);
    });
  });
});