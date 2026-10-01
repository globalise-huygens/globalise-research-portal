import { useEffect, useRef } from 'react';
import { DebugRerenderState } from './DebugRerenderState.ts';

type RenderValues = Record<string, unknown>;

const budgets = new Map<string, DebugRerenderState>();

export function useDebugRerenders(
  name: string,
  values: RenderValues,
  maxRenders: number,
): void {
  const previousRef = useRef<RenderValues | null>(null);

  useEffect(() => {
    if (!import.meta.env.DEV || previousRef.current === values) {
      return;
    }
    const reason = describeRenderReason(previousRef.current, values);
    previousRef.current = values;
    getBudget(name, maxRenders).record(reason);
  });
}

export function describeRenderReason(
  previous: RenderValues | null,
  current: RenderValues,
): string {
  if (!previous) {
    return 'mount';
  }
  const changed = Object.keys(current)
    .filter((key) => !Object.is(previous[key], current[key]));
  return changed.length ? changed.join(', ') : 'state';
}

function getBudget(name: string, maxRenders: number): DebugRerenderState {
  let budget = budgets.get(name);
  if (!budget) {
    budget = new DebugRerenderState(name, { maxRenders });
    budgets.set(name, budget);
  }
  return budget;
}
