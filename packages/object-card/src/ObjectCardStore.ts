import { create } from 'zustand';
import { fetchJson, isUrl } from '@globalise/common';
import { SkosConcept } from './ObjectCardModel.ts';

export type ObjectCardState = {
  url: string | null;
  concept: SkosConcept | null;
  isLoading: boolean;
  isReady: boolean;
  error: string | null;
};

export type ObjectCardSlice = {
  objectCard: ObjectCardState;
};

export const emptyObjectCardState: ObjectCardState = {
  url: null,
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
  const url = getSkosUrl(uri);
  const { objectCard } = useObjectCardStore.getState();
  const isUrlEqual = objectCard.url === url;
  const isUrlLoaded = objectCard.isReady
    || objectCard.isLoading
    || objectCard.error;
  if (isUrlEqual && isUrlLoaded) {
    return;
  }
  setState({ objectCard: { ...emptyObjectCardState, url, isLoading: true } });

  try {
    const concept = await fetchJson<SkosConcept>(url);
    setState({ objectCard: { ...emptyObjectCardState, url, concept, isReady: true } });
  } catch (e) {
    const error = e instanceof Error ? e.message : 'Unknown error';
    setState({ objectCard: { ...emptyObjectCardState, url, error } });
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
