import { createRoot } from 'react-dom/client';
import { router } from './router.tsx';
import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';

const root = document.getElementById('root');
if(!root) {
  throw new Error('No root element');
}
createRoot(root).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
