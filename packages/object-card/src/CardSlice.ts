import { fetchJson, getJsonUrl, isLinkedArtNode } from '@globalise/common';
import { setObjectCardState, useObjectCardStore } from './ObjectCardStore.ts';
import { isSkosConcept, setConcept } from './skos';
import { setEntity } from './linkedart';
import { CardKind, CardState, emptyCardState } from './CardState.ts';
import { getErrorMessage, isRequested } from './LoadState.ts';

export type CardSlice = {
  cardState: CardState;
};

export async function loadObjectCard(uri: string) {
  const { cardState } = useObjectCardStore.getState();
  if (isRequested(cardState, uri)) {
    return;
  }
  setObjectCardState({ cardState: { ...emptyCardState, uri, isLoading: true } });

  try {
    const payload = await fetchJson<unknown>(getJsonUrl(uri));
    const kind = keep(uri, payload);
    setObjectCardState({ cardState: { ...emptyCardState, uri, kind, isReady: true } });
  } catch (e) {
    const error = getErrorMessage(e);
    setObjectCardState({ cardState: { ...emptyCardState, uri, error } });
  }
}

export function useCard(): CardState {
  return useObjectCardStore((s) => s.cardState);
}

function keep(uri: string, payload: unknown): CardKind {
  if (isSkosConcept(payload)) {
    setConcept(uri, payload);
    return 'skos';
  }
  if (isLinkedArtNode(payload)) {
    setEntity(uri, payload);
    return 'entity';
  }
  throw new Error('Not a concept or entity');
}
