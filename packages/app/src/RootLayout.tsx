import { Outlet, useRouter } from '@globalise/router';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-aria-components';
import { SiteNavbar } from './SiteNavbar.tsx';
import './index.css';

export function RootLayout() {
  const router = useRouter();

  return (
    <QueryClientProvider client={router.options.context.queryClient}>
      <RouterProvider navigate={(href) => void router.navigate({ href })}>
        <div className='site-shell'>
          <SiteNavbar/>
          <div className='site-content'>
            <Outlet/>
          </div>
        </div>
      </RouterProvider>
    </QueryClientProvider>
  );
}
