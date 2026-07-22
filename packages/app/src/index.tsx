import { createRoot } from 'react-dom/client';
import { router } from './router.tsx';
import { RouterProvider } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';

const root = document.getElementById('root');
if(!root) {
  throw new Error('No root element');
}

const queryClient = new QueryClient();

createRoot(root).render(
  <>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} context={{ queryClient }}/>
    </QueryClientProvider>
  </>,
);
