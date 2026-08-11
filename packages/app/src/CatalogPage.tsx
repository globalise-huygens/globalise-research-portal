import { getRouteApi } from '@tanstack/react-router';
import {
  catalogUri,
  CollectionPage,
  loadCollection,
  useCollection,
} from '@globalise/object-card';
import { useUriSync } from './useUriSync.ts';
import '@globalise/design/styles.css';

const route = getRouteApi('/catalog/');

export function CatalogPage() {
  const { uri } = route.useSearch();
  const { uri: loadedUri } = useCollection();

  useUriSync(uri ?? catalogUri, loadedUri, loadCollection, '/catalog');

  return <CollectionPage/>;
}
