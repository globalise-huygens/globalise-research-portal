import { createFileRoute } from '@tanstack/react-router';
import { Home } from '../Home.tsx';
import { landingPageContent } from '../landingPageContent';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: landingPageContent.metadata.title },
      { name: 'description', content: landingPageContent.metadata.description },
    ],
  }),
  component: Home,
});

