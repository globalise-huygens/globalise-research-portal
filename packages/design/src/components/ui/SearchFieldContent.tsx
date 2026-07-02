import { cn } from '@/lib/utils';
import { Input as AriaInput, Label as AriaLabel } from 'react-aria-components';
import { IconSearch } from '../icons/IconSearch';

export type SearchFieldContentProps = {
  ariaLabel: string;
  placeholder: string;
  inputClassName?: string;
};

function SearchFieldContent({
  ariaLabel,
  placeholder,
  inputClassName,
}: SearchFieldContentProps) {
  return (
    <>
      <AriaLabel className="gds-search-field-label">{ariaLabel}</AriaLabel>
      <IconSearch className="gds-search-field-icon" aria-hidden="true" />
      <AriaInput
        placeholder={placeholder}
        className={cn('gds-search-field-input', inputClassName)}
      />
    </>
  );
}

export { SearchFieldContent };
