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
import type { ContentPageLoaderData } from './routeLoaders.ts';
import { isBlogPost } from './isBlogPost.ts';
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
      if (match?.routeId === '/content/') {
        return 'content-index';
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
          <NavSearchBar
            aria-label="Search site content"
            placeholder="Search site content"
            onSubmit={(value) => {
              void router.navigate({
                to: '/content',
                search: { q: value.trim() || undefined },
              });
            }}
          />
        )}
        {contentPage && (
          <NavLinks className="site-navbar__links">
            <NavLink href={toHref({ to: '/search' })}>Archive search</NavLink>
            <NavLink href={toHref({ to: '/content/blog' })}>Blog</NavLink>
          </NavLinks>
        )}
        {!contentPage && <NavLinks className="site-navbar__links">
          <NavLink href={toHref({ to: '/search' })}>Search</NavLink>
          <NavLink href={toViewerHref(defaultInventory, {})}>Manifest Viewer</NavLink>
          <NavLink href={toHref({ to: '/catalog' })}>Catalog</NavLink>
          <NavLink href={toHref({ to: '/object-card' })}>Object Card</NavLink>
          <NavLink href={toHref({ to: '/map' })}>World map</NavLink>
          <NavLink href={toHref({ to: '/content' })}>Content</NavLink>
          <NavLink href={toHref({ to: '/content/blog' })}>Blog</NavLink>
        </NavLinks>}
      </Navbar>
    </header>
  );
}
