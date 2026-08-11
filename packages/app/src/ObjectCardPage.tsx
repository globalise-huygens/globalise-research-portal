import { getRouteApi } from '@tanstack/react-router';
import {
  loadObjectCard,
  ObjectCardView,
  useCard,
} from '@globalise/object-card';
import { useUriSync } from './useUriSync.ts';
import '@globalise/design/styles.css';

const route = getRouteApi('/object-card/');

const defaultUri =
  'https://data.globalise.huygens.knaw.nl/' +
  'hdl:20.500.14722/thesaurus:00caf575-0d33-49f0-83d7-3f550c681355';

export function ObjectCardPage() {
  const { uri } = route.useSearch();
  const { uri: loadedUri } = useCard();

  useUriSync(uri ?? defaultUri, loadedUri, loadObjectCard, '/object-card');

  return <ObjectCardView/>;
}
