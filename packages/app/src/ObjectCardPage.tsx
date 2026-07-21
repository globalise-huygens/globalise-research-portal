import { ObjectCard, useObjectCardStore, loadObjectCard } from '@globalise/object-card';
import '@globalise/design/styles.css';
import { useEffect } from 'react';

const DEFAULT_URI =
  'https://data.globalise.huygens.knaw.nl/' +
  'hdl:20.500.14722/thesaurus:225cef07-5b8e-4a8b-a141-2471a0cffce8';

const CONCEPT = 'concept';

export function ObjectCardPage() {

  useEffect(initLoadObjectCard, []);
  function initLoadObjectCard() {
    const uri = new URLSearchParams(location.search)
      .get(CONCEPT)
      ?? DEFAULT_URI;
    setConceptParam(uri);
    loadObjectCard(uri).catch(console.error);
  }

  useEffect(syncConceptParam, []);
  function syncConceptParam() {
    return useObjectCardStore.subscribe((state, prev) => {
      const { uri } = state.objectCard;
      if (!uri || uri === prev.objectCard.uri) {
        return;
      }
      setConceptParam(uri);
    });
  }

  return <ObjectCard />;
}

function setConceptParam(uri: string) {
  const url = new URL(window.location.href);
  const urlParamUri = url.searchParams.get(CONCEPT);
  if (urlParamUri === uri) {
    return;
  }
  url.searchParams.set(CONCEPT, uri);
  history.replaceState({}, '', url);
}
