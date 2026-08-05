import '@globalise/design/styles.css';
import './ObjectCardPage.css';
import {
  ConceptCard,
  loadConcept,
  useObjectCardStore,
} from '@globalise/object-card';
import { useEffect } from 'react';

const DEFAULT_URI =
  'https://data.globalise.huygens.knaw.nl/' +
  'hdl:20.500.14722/thesaurus:00caf575-0d33-49f0-83d7-3f550c681355';

const CONCEPT = 'concept';

export function ObjectCardPage() {
  useEffect(initLoadObjectCard, []);
  function initLoadObjectCard() {
    const uri = getUriFromUrl();
    setConceptParam(uri, 'replace');
    loadConcept(uri).catch(console.error);
  }

  useEffect(handleHistoryNav, []);
  function handleHistoryNav() {
    const onPopState = () => {
      const uri = getUriFromUrl();
      loadConcept(uri).catch(console.error);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }

  useEffect(syncConceptParam, []);
  function syncConceptParam() {
    return useObjectCardStore.subscribe((state, prev) => {
      const { uri } = state.skosConceptState;
      if (!uri || uri === prev.skosConceptState.uri) {
        return;
      }
      setConceptParam(uri, 'push');
    });
  }

  return (
    <main className="object-card-page">
      <div className="object-card-page__content">
        <ConceptCard/>
      </div>
    </main>
  );
}

function getUriFromUrl() {
  return new URLSearchParams(location.search)
    .get(CONCEPT)
    ?? DEFAULT_URI;
}

function setConceptParam(uri: string, mode: 'push' | 'replace') {
  const url = new URL(window.location.href);
  const urlParamUri = url.searchParams.get(CONCEPT);
  if (urlParamUri === uri) {
    return;
  }
  url.searchParams.set(CONCEPT, uri);
  if (mode === 'push') {
    history.pushState({}, '', url);
  } else {
    history.replaceState({}, '', url);
  }
}
