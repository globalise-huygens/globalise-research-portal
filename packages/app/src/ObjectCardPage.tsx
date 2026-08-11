import { useEffect } from 'react';
import { getRouteApi } from '@tanstack/react-router';
import { loadObjectCard, ObjectCardView } from '@globalise/object-card';
import '@globalise/design/styles.css';

const route = getRouteApi('/object-card/');

const defaultUri =
  'https://data.globalise.huygens.knaw.nl/' +
  'hdl:20.500.14722/thesaurus:00caf575-0d33-49f0-83d7-3f550c681355';

export function ObjectCardPage() {
  const { uri } = route.useSearch();

  useEffect(() => {
    loadObjectCard(uri ?? defaultUri).catch(console.error);
  }, [uri]);

  return <ObjectCardView/>;
}
