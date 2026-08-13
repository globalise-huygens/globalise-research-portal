import '@globalise/design/styles.css';
import './ObjectCardPage.css';
import { useEffect } from 'react';
import { getRouteApi } from '@tanstack/react-router';
import { loadObjectCard, ObjectCardView } from '@globalise/object-card';

const route = getRouteApi('/object-card/');

const defaultUri =
  'https://data.globalise.huygens.knaw.nl/' +
  'hdl:20.500.14722/thesaurus:00caf575-0d33-49f0-83d7-3f550c681355';

export function ObjectCardPage() {
  const { uri } = route.useSearch();

  useEffect(() => {
    loadObjectCard(uri ?? defaultUri).catch(console.error);
  }, [uri]);

  return (
    <main className='object-card-page'>
      <div className='object-card-page__content'>
        <ObjectCardView/>
      </div>
    </main>
  );
}