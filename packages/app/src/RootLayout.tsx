import { Outlet, useRouter } from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-aria-components';
import { SiteNavbar } from './SiteNavbar.tsx';
import { ObjectCardOverlay } from '@globalise/design';
import { clearObjectCard, ObjectCardView, useCard } from '@globalise/object-card';

export function RootLayout() {
  const router = useRouter();

  return (
    <QueryClientProvider client={router.options.context.queryClient}>
      <RouterProvider navigate={(to) => void router.navigate({ to })}>
        <div className='site-shell'>
          <SiteNavbar/>
          <div className='site-content'>
            <Outlet/>
          </div>
          <ObjectCardModal/>
        </div>
      </RouterProvider>
    </QueryClientProvider>
  );
}

function ObjectCardModal() {
  const { uri } = useCard();
  const isOpen = Boolean(uri);

  function close() {
    clearObjectCard();
  }

  return (
    <ObjectCardOverlay isOpen={isOpen} onOpenChange={(open) => {
      if (!open) {
        close();
      }
    }}>
      <ObjectCardView onClose={close}/>
    </ObjectCardOverlay>
  );
}
