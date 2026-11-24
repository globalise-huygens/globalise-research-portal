import { useEffect, useEffectEvent } from 'react';

export function useDismissOnOutsideWheel(
  enabled: boolean,
  getOverlay: () => HTMLElement | null,
  onDismiss: () => void,
) {
  const handleWheel = useEffectEvent((event: WheelEvent) => {
    const target = event.target;
    if (target instanceof Node && getOverlay()?.contains(target)) {
      return;
    }
    onDismiss();
  });

  useEffect(() => {
    if (!enabled) {
      return;
    }
    window.addEventListener('wheel', handleWheel, {
      capture: true, passive: true,
    });
    return () => window.removeEventListener('wheel', handleWheel, true);
  }, [enabled]);
}
