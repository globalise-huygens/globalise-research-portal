import { IconClose } from '../icons';
import { IconMenu } from '../icons';
import { cn } from '../../lib';
import * as React from 'react';
import {
  Button as AriaButton,
  Link as AriaLink,
  type LinkProps as AriaLinkProps,
  SearchField as AriaSearchField,
  type SearchFieldProps as AriaSearchFieldProps,
} from 'react-aria-components';
import { SearchFieldContent } from './SearchFieldContent';

/* -------------------------------------------------------------------------- */
/*  Internal type marker for mobile layout detection                          */
/* -------------------------------------------------------------------------- */

type NavComponentType = 'NavSearchBar' | 'NavLink' | 'NavLinks';

function getNavType(child: React.ReactElement): NavComponentType | undefined {
  const type = child.type as React.FC & {
    displayName?: string;
    __navType?: NavComponentType;
  };
  return type.__navType ?? (type.displayName as NavComponentType | undefined);
}

/* -------------------------------------------------------------------------- */
/*  NavSearchBar                                                               */
/* -------------------------------------------------------------------------- */

export type NavSearchBarProps = {
  className?: string;
  placeholder?: string;
} & Omit<
  AriaSearchFieldProps,
  'className' | 'style'
>;

const NavSearchBar = React.forwardRef<HTMLDivElement, NavSearchBarProps>(
  ({ className, placeholder = 'Search the archive', ...props }, ref) => {
    const ariaLabel = props['aria-label'] ?? placeholder;

    return (
      <AriaSearchField
        ref={ref}
        aria-label={ariaLabel}
        className={cn('gds-nav-search', className)}
        {...props}
      >
        <SearchFieldContent ariaLabel={ariaLabel} placeholder={placeholder} />
      </AriaSearchField>
    );
  },
);
NavSearchBar.displayName = 'NavSearchBar';
(NavSearchBar as React.FC & { __navType?: NavComponentType }).__navType =
  'NavSearchBar';

/* -------------------------------------------------------------------------- */
/*  NavLink                                                                    */
/* -------------------------------------------------------------------------- */

export type NavLinkProps = {
  className?: string;
} & Omit<
  AriaLinkProps,
  'className' | 'style'
>;

const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, ...props }, ref) => (
    <AriaLink ref={ref} className={cn('gds-nav-link', className)} {...props} />
  ),
);
NavLink.displayName = 'NavLink';
(NavLink as React.FC & { __navType?: NavComponentType }).__navType = 'NavLink';

/* -------------------------------------------------------------------------- */
/*  NavLinks container                                                         */
/* -------------------------------------------------------------------------- */

export type NavLinksProps = {} & React.HTMLAttributes<HTMLDivElement>;

const NavLinks = React.forwardRef<HTMLDivElement, NavLinksProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('gds-nav-links', className)} {...props} />
  ),
);
NavLinks.displayName = 'NavLinks';
(NavLinks as React.FC & { __navType?: NavComponentType }).__navType =
  'NavLinks';

/* -------------------------------------------------------------------------- */
/*  Navbar                                                                     */
/* -------------------------------------------------------------------------- */

export type NavbarProps = {
  /** Logo element (image, SVG, or React node) */
  logo?: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>;

const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  ({ className, logo, children, ...props }, ref) => {
    const [mobileOpen, setMobileOpen] = React.useState(false);

    return (
      <nav ref={ref} className={cn('gds-navbar', className)} {...props}>
        {/* Top bar: logo + mobile toggle */}
        <div className="gds-navbar__top">
          {logo && <div className="gds-navbar__logo">{logo}</div>}
          <AriaButton
            className="gds-navbar__toggle"
            onPress={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? (
              <IconClose className="gds-navbar__toggle-icon" />
            ) : (
              <IconMenu className="gds-navbar__toggle-icon" />
            )}
          </AriaButton>
        </div>

        {/* Desktop: center + right content */}
        {children}

        {/* Mobile expanded panel */}
        {mobileOpen && (
          <div className="gds-navbar__mobile-panel">
            {React.Children.map(children, (child) => {
              if (!React.isValidElement(child)) {return null;}
              const navType = getNavType(child);
              if (navType === 'NavLinks') {
                return (
                  <div className="gds-navbar__mobile-links">
                    {
                      (
                        child as React.ReactElement<{
                          children?: React.ReactNode;
                        }>
                      ).props.children
                    }
                  </div>
                );
              }
              if (navType === 'NavSearchBar') {
                return React.cloneElement(
                  child as React.ReactElement<{
                    className?: string;
                    'data-mobile'?: string;
                  }>,
                  {
                    'data-mobile': 'true',
                  },
                );
              }
              return child;
            })}
          </div>
        )}
      </nav>
    );
  },
);
Navbar.displayName = 'Navbar';

export { Navbar, NavLink, NavLinks, NavSearchBar };
