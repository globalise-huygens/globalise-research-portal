import { createFileRoute } from '@tanstack/react-router';
import { ContentIndexPage } from '../../ContentIndexPage.tsx';
import { getContentIndex } from '../../content.ts';

export const Route = createFileRoute('/content/')({
  loader: () => getContentIndex(),
  component: ContentIndexRoute,
});

function ContentIndexRoute() {
  return <ContentIndexPage pages={Route.useLoaderData()}/>;
}
