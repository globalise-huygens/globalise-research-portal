import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DebugRerenderState } from './DebugRerenderState.ts';

describe(DebugRerenderState.name, () => {
  const warn = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    warn.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function recordAll(budget: DebugRerenderState, reasons: string[]) {
    reasons.forEach((reason) => budget.record(reason));
  }

  it('warns with render count and reasons when over budget', () => {
    const budget = new DebugRerenderState('Word', { maxRenders: 2, warn });

    recordAll(budget, ['mount', 'mount', 'selected']);
    vi.advanceTimersByTime(1000);

    expect(warn).toHaveBeenCalledWith(
      '[render budget] Word: 3 renders in 1000 ms (max 2)',
      { mount: 2, selected: 1 },
    );
  });

  it('stays silent within budget', () => {
    const budget = new DebugRerenderState('Word', { maxRenders: 2, warn });

    recordAll(budget, ['mount', 'mount']);
    vi.advanceTimersByTime(1000);

    expect(warn).not.toHaveBeenCalled();
  });

  it('starts counting anew after each window', () => {
    const budget = new DebugRerenderState('Word', { maxRenders: 2, warn });

    recordAll(budget, ['mount', 'mount']);
    vi.advanceTimersByTime(1000);
    recordAll(budget, ['state', 'state']);
    vi.advanceTimersByTime(1000);

    expect(warn).not.toHaveBeenCalled();
  });
});
