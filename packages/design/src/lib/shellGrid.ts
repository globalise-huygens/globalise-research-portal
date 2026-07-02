import * as React from 'react';

export type ShellGridModel = {
  start: number;
  end: number;
  label: 'desktop' | 'tablet' | 'mobile';
};

export function getShellGridModel(columnCount: number): ShellGridModel {
  if (columnCount >= 16) {
    return { start: 3, end: 14, label: 'desktop' };
  }

  if (columnCount >= 8) {
    return { start: 2, end: 7, label: 'tablet' };
  }

  return { start: 1, end: columnCount, label: 'mobile' };
}

export function readShellColumnCount(defaultCount = 16): number {
  if (typeof window === 'undefined') {
    return defaultCount;
  }

  const rootStyles = getComputedStyle(document.documentElement);
  const rawValue = rootStyles.getPropertyValue('--shell-cols').trim();
  const parsed = Number.parseInt(rawValue, 10);

  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }

  return defaultCount;
}

export function useShellColumnCount({
  enabled = true,
  initialCount = 16,
}: {
  enabled?: boolean;
  initialCount?: number;
} = {}): number {
  const [columnCount, setColumnCount] = React.useState(initialCount);

  React.useEffect(() => {
    if (!enabled) {
      return;
    }

    const updateColumnCount = () => {
      setColumnCount(readShellColumnCount(initialCount));
    };

    updateColumnCount();
    window.addEventListener('resize', updateColumnCount);
    return () => window.removeEventListener('resize', updateColumnCount);
  }, [enabled, initialCount]);

  return columnCount;
}
