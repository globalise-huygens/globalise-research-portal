import { getRouteApi } from '@globalise/router';
import { ContentPageView } from './ContentPageView.tsx';
import type { ContentPageLoaderData } from './routeLoaders.ts';

const route = getRouteApi('/content/$slug');

export function ContentPage() {
  const content: ContentPageLoaderData = route.useLoaderData();
  const { page, relatedPosts } = content;
  const { q } = route.useSearch();
  return <ContentPageView page={page} query={q} relatedPosts={relatedPosts}/>;
}
