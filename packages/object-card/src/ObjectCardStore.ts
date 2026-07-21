import { create } from 'zustand';
import { fetchJson, isUrl } from '@globalise/common';
import { SkosConcept } from './ObjectCardModel.ts';

export type ObjectCardState = {
  uri: string | null;
  concept: SkosConcept | null;
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
};

export type ObjectCardSlice = {
  objectCard: ObjectCardState;
};

export const emptyObjectCardState: ObjectCardState = {
  uri: null,
  concept: null,
  isLoading: false,
  isReady: false,
  error: null,
};

export const defaultObjectCardSlice: ObjectCardSlice = {
  objectCard: emptyObjectCardState,
};

export const useObjectCardStore = create<ObjectCardSlice>(
  () => ({ ...defaultObjectCardSlice }),
);

const setState = useObjectCardStore.setState;

export async function loadObjectCard(uri: string) {
  const { objectCard } = useObjectCardStore.getState();
  const isUrlEqual = objectCard.uri === uri;

  const isUrlLoaded = objectCard.isReady
    || objectCard.isLoading
    || objectCard.error;
  if (isUrlEqual && isUrlLoaded) {
    return;
  }
  setState({ objectCard: { ...emptyObjectCardState, uri, isLoading: true } });

  try {
    const url = getSkosUrl(uri);
    const concept = await fetchJson<SkosConcept>(url);
    setState({ objectCard: { ...emptyObjectCardState, uri, concept, isReady: true } });
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error';
    setState({ objectCard: { ...emptyObjectCardState, uri, error } });
  }
}

export function useObjectCard(): ObjectCardState {
  return useObjectCardStore((s) => s.objectCard);
}

export function getSkosUrl(uri: string): string {
  const result = `${uri}.json`;
  if(!isUrl(result)) {
    throw new Error(`Could not create url from uri ${uri}`);
  }
  return result;
}
