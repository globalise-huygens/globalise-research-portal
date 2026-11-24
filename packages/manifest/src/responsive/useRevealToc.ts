import { useEffect, useEffectEvent } from 'react';
import { useDocumentStore } from '@globalise/common/document';

export function useRevealToc(revealToc: () => void) {
  const reveal = useEffectEvent(revealToc);

  useEffect(() => useDocumentStore.subscribe((state, previous) => {
    const navigation = state.toc.navigation;
    if (navigation?.target === 'reveal'
      && navigation !== previous.toc.navigation) {
      reveal();
    }
  }), []);
}
