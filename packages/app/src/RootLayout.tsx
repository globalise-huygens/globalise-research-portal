import { Outlet, useRouter } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-aria-components';
import { SiteNavbar } from './SiteNavbar.tsx';

export function RootLayout() {
  const router = useRouter();

  return (
    <QueryClientProvider client={router.options.context.queryClient}>
      <RouterProvider navigate={(to) => void router.navigate({ to })}>
        <div className="site-shell">
          <SiteNavbar />
          <div className="site-content">
            <Outlet />
          </div>
        </div>
      </RouterProvider>
    </QueryClientProvider>
  );
}
