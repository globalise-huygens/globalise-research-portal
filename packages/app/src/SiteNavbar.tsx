import { useState } from 'react';
import type { SubmitEvent } from 'react';
import { useRouterState } from '@tanstack/react-router';
import { Button, Input, SearchField } from 'react-aria-components';
import {
  LogoNavbar,
  Navbar,
  NavLink,
  NavLinks,
} from '@globalise/design';
import {
  defaultInventory,
  toHref,
  toViewerHref,
  useRouter,
} from '@globalise/router';
import type { ContentPageLoaderData } from './routeLoaders.ts';
import { isBlogPost } from './blogPost.ts';
import '@globalise/design/styles.css';
import './SiteNavbar.css';

export function SiteNavbar() {
  const router = useRouter();
  const [contentSearchOpen, setContentSearchOpen] = useState(false);
  const isContentPage = useRouterState({
    select: ({ matches }) => {
      const match = matches.at(-1);
      if (match?.routeId === '/content/' ||
          match?.routeId === '/content/blog') {
        return true;
      }
      if (match?.routeId !== '/content/$slug') {
        return false;
      }
      const content = match.loaderData as ContentPageLoaderData | undefined;
      return Boolean(content && isBlogPost(content.page.meta));
    },
  });

  function searchContent(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get('q');
    const query = typeof value === 'string' ? value.trim() : '';
    setContentSearchOpen(false);
    void router.navigate({
      to: '/content',
      search: { q: query || undefined },
    });
  }

  return (
    <header className="site-header">
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
        <NavLinks className="site-navbar__links">
          <NavLink href={toHref({ to: '/search' })}>Search</NavLink>
          <NavLink href={toViewerHref(defaultInventory, {})}>Manifest Viewer</NavLink>
          <NavLink href={toHref({ to: '/catalog' })}>Catalog</NavLink>
          <NavLink href={toHref({ to: '/object-card' })}>Object Card</NavLink>
          <NavLink href={toHref({ to: '/map' })}>World map</NavLink>
          <NavLink href={toHref({ to: '/content' })}>Content</NavLink>
          <NavLink href={toHref({ to: '/content/blog' })}>Blog</NavLink>
          {isContentPage && (
            <Button
              className="content-search-toggle"
              aria-label={contentSearchOpen
                ? 'Close site content search'
                : 'Search site content'}
              aria-expanded={contentSearchOpen}
              onPress={() => setContentSearchOpen((open) => !open)}
            >
              <ContentSearchIcon/>
            </Button>
          )}
        </NavLinks>
      </Navbar>
      {contentSearchOpen && isContentPage && (
        <form className="content-search-popover" onSubmit={searchContent}>
          <SearchField aria-label="Search site content">
            <Input
              autoFocus
              name="q"
              placeholder="Search site content"
            />
            <Button type="submit" aria-label="Submit site content search">
              <ContentSearchIcon/>
            </Button>
          </SearchField>
        </form>
      )}
    </header>
  );
}

function ContentSearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="content-search-icon"
    >
      <path d="M10 3a7 7 0 1 0 4.3 12.52L20 21.2l1.2-1.2-5.68-5.7A7 7 0 0 0 10 3Zm0 1.7a5.3 5.3 0 1 1 0 10.6 5.3 5.3 0 0 1 0-10.6Z"/>
      <path d="M3 20h10v1.6H3zM3 17.2h7v1.5H3z"/>
    </svg>
  );
}
