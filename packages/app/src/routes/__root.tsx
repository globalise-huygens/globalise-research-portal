import { createRootRoute, Outlet } from '@tanstack/react-router';
import { SiteNavbar } from '../SiteNavbar.tsx';

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="site-shell">
      <SiteNavbar />
      <div className="site-content">
        <Outlet />
      </div>
    </div>
  );
}
