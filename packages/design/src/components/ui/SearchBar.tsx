import { cn } from '../../lib';
import * as React from 'react';
import {
  SearchField as AriaSearchField,
  type SearchFieldProps as AriaSearchFieldProps,
} from 'react-aria-components';
import { SearchFieldContent } from './SearchFieldContent';

type SearchBarVariant = 'default' | 'subtle' | 'solid';
type SearchBarSize = 'default' | 'sm' | 'lg';

function searchBarVariants({ className }: { className?: string } = {}) {
  return cn('gds-search-bar', className);
}

export type SearchBarProps = {
  className?: string;
  variant?: SearchBarVariant;
  size?: SearchBarSize;
  placeholder?: string;
} & Omit<
  AriaSearchFieldProps,
  'className' | 'style'
>;

const SearchBar = React.forwardRef<HTMLDivElement, SearchBarProps>(
  ({ className, variant, size, placeholder = 'Search…', ...props }, ref) => {
    const ariaLabel = props['aria-label'] ?? placeholder;

    return (
      <AriaSearchField
        ref={ref}
        aria-label={ariaLabel}
        className={searchBarVariants({ className })}
        data-size={size ?? 'default'}
        data-variant={variant ?? 'default'}
        {...props}
      >
        <SearchFieldContent
          ariaLabel={ariaLabel}
          placeholder={placeholder}
          inputClassName="gds-search-field-input--medium"
        />
      </AriaSearchField>
    );
  },
);
SearchBar.displayName = 'SearchBar';

export { SearchBar, searchBarVariants };
