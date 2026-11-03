import { getRouteApi } from '@globalise/router';
import { ContentPageView } from './ContentPageView.tsx';
import type { ContentPage as ContentPageData } from '@globalise/content';

const route = getRouteApi('/content/$slug');

export function ContentPage() {
  const page: ContentPageData = route.useLoaderData();
  const { q } = route.useSearch();
  return <ContentPageView page={page} query={q}/>;
}
