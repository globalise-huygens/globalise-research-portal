import {
  LogoNavbar,
  Navbar,
  NavSearchBar,
  NavLink,
  NavLinks,
} from '@globalise/design';
import { useRouterState } from '@tanstack/react-router';
import {
  defaultInventory,
  toHref,
  toViewerHref,
  useRouter,
} from '@globalise/router';
import { isBlogPost } from './isBlogPost.ts';
import type { ContentPageLoaderData } from './routeLoaders.ts';
import '@globalise/design/styles.css';
import './SiteNavbar.css';

export function SiteNavbar() {
  const router = useRouter();
  const contentPage = useRouterState({
    select: ({ matches }) => {
      const match = matches.at(-1);
      if (match?.routeId === '/content/blog') {
        return 'blog-index';
      }
      if (match?.routeId === '/content/$slug') {
        const content = match.loaderData as ContentPageLoaderData | undefined;
        if (content && isBlogPost(content.page.meta)) {
          return 'blog-post';
        }
      }
      return undefined;
    },
  });

  return (
    <header className="site-header" data-content-page={contentPage}>
      <Navbar
        aria-label="Primary navigation"
        logo={
          <NavLink
            href={toHref({ to: '/' })}
            aria-label="Globalise home"
            className="site-navbar__home"
          >
            <LogoNavbar className="site-navbar__logo"/>
          </NavLink>
        }
      >
        {contentPage && (
          <NavSearchBar onSubmit={(q) => {
            void router.navigate({ to: '/search', search: { q: q.trim() } });
          }}/>
        )}
        {contentPage && (
          <NavLinks className="site-navbar__links">
            <NavLink href={toHref({ to: '/search' })}>Archive</NavLink>
            <NavLink href={toHref({ to: '/content/blog' })}>Explore</NavLink>
            <NavLink href={router.buildLocation({
              to: '/content/$slug',
              params: { slug: 'about' },
            }).href}>About</NavLink>
          </NavLinks>
        )}
        {!contentPage && (
          <NavLinks className="site-navbar__links">
            <NavLink href={toHref({ to: '/search' })}>Search</NavLink>
            <NavLink href={toViewerHref(defaultInventory, {})}>Manifest Viewer</NavLink>
            <NavLink href={toHref({ to: '/catalog' })}>Catalog</NavLink>
            <NavLink href={toHref({ to: '/object-card' })}>Object Card</NavLink>
            <NavLink href={toHref({ to: '/map' })}>World map</NavLink>
            <NavLink href={toHref({ to: '/content' })}>Content</NavLink>
          </NavLinks>
        )}
      </Navbar>
    </header>
  );
}
