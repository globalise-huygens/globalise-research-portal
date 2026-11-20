import { useLocation } from '@tanstack/react-router';
import { Outlet, useRouter } from '@globalise/router';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-aria-components';
import { SiteFooter } from './SiteFooter.tsx';
import { SiteNavbar } from './SiteNavbar.tsx';
import './index.css';

export function RootLayout() {
  const router = useRouter();
  const showFooter = useLocation({
    select: ({ pathname }) =>
      pathname === '/' ||
      pathname === '/content' ||
      pathname.startsWith('/content/'),
  });

  return (
    <QueryClientProvider client={router.options.context.queryClient}>
      <RouterProvider navigate={(href) => void router.navigate({ href })}>
        <div className='site-shell'>
          <SiteNavbar/>
          <div className='site-content'>
            <Outlet/>
            {showFooter && <SiteFooter/>}
          </div>
        </div>
      </RouterProvider>
    </QueryClientProvider>
  );
}
