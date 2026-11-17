import { useSyncExternalStore } from 'react';

const mobileQuery = '(max-width: 767px)';

export function useIsMobile(): boolean {
  return useSyncExternalStore(subscribe, isMobile, () => false);
}

function subscribe(onChange: () => void): () => void {
  const query = window.matchMedia(mobileQuery);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

function isMobile(): boolean {
  return window.matchMedia(mobileQuery).matches;
}
