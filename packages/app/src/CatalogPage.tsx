import { getRouteApi } from '@tanstack/react-router';
import { catalogUri } from '@globalise/object-card';
import { ResourcePage } from './ResourcePage.tsx';

const route = getRouteApi('/catalog/');

export function CatalogPage() {
  const { uri } = route.useSearch();
  return <ResourcePage uri={uri ?? catalogUri} to="/catalog"/>;
}
