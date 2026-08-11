import { useEffect } from 'react';
import { getRouteApi } from '@tanstack/react-router';
import {
  catalogUri,
  CollectionPage,
  loadCatalog,
} from '@globalise/object-card';
import '@globalise/design/styles.css';

const route = getRouteApi('/catalog/');

export function CatalogPage() {
  const { uri } = route.useSearch();

  useEffect(() => {
    loadCatalog(uri ?? catalogUri).catch(console.error);
  }, [uri]);

  return <CollectionPage/>;
}
