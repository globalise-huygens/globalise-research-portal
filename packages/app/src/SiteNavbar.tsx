import {
  LogoNavbar,
  Navbar,
  NavLink,
  NavLinks,
} from '@globalise/design';
import { toHref } from '@globalise/router';
import '@globalise/design/styles.css';
import './SiteNavbar.css';

export function SiteNavbar() {
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
          <NavLink href={toHref({ to: '/manifest' })}>Manifest Viewer</NavLink>
          <NavLink href={toHref({ to: '/catalog' })}>Catalog</NavLink>
          <NavLink href={toHref({ to: '/object-card' })}>Object Card</NavLink>
          <NavLink href={toHref({ to: '/map' })}>World map</NavLink>
        </NavLinks>
      </Navbar>
    </header>
  );
}
