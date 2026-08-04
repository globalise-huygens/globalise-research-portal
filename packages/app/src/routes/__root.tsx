import { createRootRoute, Outlet } from '@tanstack/react-router';
import { SiteNavbar } from '../SiteNavbar.tsx';

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <>
      <SiteNavbar />
      <Outlet />
    </>
  );
}
