import { createFileRoute } from '@tanstack/react-router';
import { Home } from '../Home.tsx';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Discover the VOC archives · GLOBALISE' },
      { name: 'description', content: 'Explore the VOC archives with GLOBALISE. Built for researchers, educators and curious audiences worldwide.' },
    ],
  }),
  component: Home,
});

