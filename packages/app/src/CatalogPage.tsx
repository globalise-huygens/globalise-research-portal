import { useEffect } from 'react';
import { getRouteApi } from '@tanstack/react-router';
import {
  CollectionPage,
  loadCatalog,
} from '@globalise/object-card';
import '@globalise/design/styles.css';

const route = getRouteApi('/catalog/');

export const catalogUri =
  'https://objectstore.surf.nl/87435b768620494e8e911c83d1997f24:globalise-data/objects/catalog.json';

export function CatalogPage() {
  const { uri } = route.useSearch();

  useEffect(() => {
    loadCatalog(uri ?? catalogUri).catch(console.error);
  }, [uri]);

  return <CollectionPage/>;
}
