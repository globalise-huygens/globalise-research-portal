import { createFileRoute } from '@tanstack/react-router';
import { ContentPageView } from '../../ContentPageView.tsx';
import { getContentPage } from '../../content.ts';

export const Route = createFileRoute('/content/$slug')({
  loader: ({ params }) => getContentPage({ data: params.slug }),
  component: ContentPageRoute,
});

function ContentPageRoute() {
  return <ContentPageView page={Route.useLoaderData()}/>;
}
