import {
  LogoNavbar,
  Navbar,
  NavLink,
  NavLinks,
} from '@globalise/design';
import '@globalise/design/styles.css';
import './SiteNavbar.css';

export function SiteNavbar() {
  return (
    <header className="site-header">
      <Navbar
        aria-label="Primary navigation"
        logo={
          <NavLink href="/" aria-label="Globalise home" className="site-navbar__home">
            <LogoNavbar className="site-navbar__logo" />
          </NavLink>
        }
      >
        <NavLinks className="site-navbar__links">
          <NavLink href="/search">Search</NavLink>
          <NavLink href="/manifest">Manifest Viewer</NavLink>
          <NavLink href="/catalog">Catalog</NavLink>
        </NavLinks>
      </Navbar>
    </header>
  );
}
