import * as React from 'react';

export function useCopy(resetAfter = 1200) {
  const [copied, setCopied] = React.useState(false);
  const resetTimer = React.useRef<number | null>(null);

  React.useEffect(() => () => {
    if (resetTimer.current !== null) {
      window.clearTimeout(resetTimer.current);
    }
  }, []);

  const copy = React.useCallback(async (value: string) => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) {
      return false;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);

      if (resetTimer.current !== null) {
        window.clearTimeout(resetTimer.current);
      }
      resetTimer.current = window.setTimeout(() => {
        setCopied(false);
        resetTimer.current = null;
      }, resetAfter);

      return true;
    } catch {
      setCopied(false);
      return false;
    }
  }, [resetAfter]);

  return { copied, copy };
}
