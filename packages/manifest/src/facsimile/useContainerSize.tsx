import { RefObject, useEffect, useState } from 'react';
import { observeResize } from './util/observeResize.tsx';

export function useContainerSize(ref: RefObject<HTMLElement | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const container = ref.current;
    if (!container) {
      return;
    }
    const rect = container.getBoundingClientRect();
    setSize({ width: rect.width, height: rect.height });

    return observeResize(container, (rect) => {
      setSize({ width: rect.width, height: rect.height });
    });
  }, [ref]);

  return size;
}