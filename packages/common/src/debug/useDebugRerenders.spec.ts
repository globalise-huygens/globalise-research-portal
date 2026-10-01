import { describe, expect, it } from 'vitest';
import { describeRenderReason } from './useDebugRerenders.ts';

describe('describeRenderReason', () => {
  it('describes a first render as mount', () => {
    expect(describeRenderReason(null, { id: 'a' })).toBe('mount');
  });

  it('lists the values that changed', () => {
    const previous = { id: 'a', selected: false, isCurrent: false };
    const current = { id: 'a', selected: true, isCurrent: true };

    expect(describeRenderReason(previous, current)).toBe('selected, isCurrent');
  });

  it('describes a render without changed values as state', () => {
    expect(describeRenderReason({ id: 'a' }, { id: 'a' })).toBe('state');
  });
});
