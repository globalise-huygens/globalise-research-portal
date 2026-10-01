import { useEffect, useRef } from 'react';

type RerenderContext = Record<string, unknown>;

type RenderCount = {
  total: number;
  reasons: Record<string, number>;
};

const intervalMs = 1000;
const renderCounts = new Map<string, RenderCount>();

export function useDebugRerenders(
  name: string,
  values: RerenderContext,
  maxRenders: number,
) {
  const previousRef = useRef<RerenderContext | null>(null);

  useEffect(() => {
    if (!import.meta.env.DEV || previousRef.current === values) {
      return;
    }
    countRender(name, getReason(previousRef.current, values), maxRenders);
    previousRef.current = values;
  });
}

function countRender(name: string, reason: string, maxRenders: number) {
  const count = renderCounts.get(name) ?? startCounting(name, maxRenders);
  count.total++;
  count.reasons[reason] = (count.reasons[reason] ?? 0) + 1;
}

function startCounting(name: string, maxRenders: number): RenderCount {
  const count: RenderCount = { total: 0, reasons: {} };
  renderCounts.set(name, count);
  setTimeout(() => {
    renderCounts.delete(name);
    if (count.total > maxRenders) {
      console.warn(
        `[debug rerenders] ${name}: ${count.total} renders in ${intervalMs} ms (max ${maxRenders})`,
        count.reasons,
      );
    }
  }, intervalMs);
  return count;
}

function getReason(previous: RerenderContext | null, current: RerenderContext): string {
  if (!previous) {
    return 'mount';
  }
  const changed = Object.keys(current)
    .filter((key) => previous[key] !== current[key]);
  return changed.length ? changed.join(', ') : 'state';
}
