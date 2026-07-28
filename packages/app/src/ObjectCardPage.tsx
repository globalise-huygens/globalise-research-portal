import { ObjectCard, SchemeList, useObjectCardStore } from '@globalise/object-card';
import '@globalise/design/styles.css';
import { useEffect } from 'react';
import { loadConcept } from '@globalise/object-card';

const DEFAULT_URI =
  'https://data.globalise.huygens.knaw.nl/' +
  'hdl:20.500.14722/thesaurus:00caf575-0d33-49f0-83d7-3f550c681355';

const CONCEPT = 'concept';

export function ObjectCardPage() {

  useEffect(initLoadObjectCard, []);
  function initLoadObjectCard() {
    const uri = new URLSearchParams(location.search)
      .get(CONCEPT)
      ?? DEFAULT_URI;
    setConceptParam(uri);
    loadConcept(uri).catch(console.error);
  }

  useEffect(syncConceptParam, []);
  function syncConceptParam() {
    return useObjectCardStore.subscribe((state, prev) => {
      const { uri } = state.conceptState;
      if (!uri || uri === prev.conceptState.uri) {
        return;
      }
      setConceptParam(uri);
    });
  }

  return (
    <>
      <SchemeList />
      <hr />
      <ObjectCard />
    </>
  );
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