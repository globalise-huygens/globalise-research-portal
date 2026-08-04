import { ReactNode, useMemo, useState } from 'react';

import './Dropdown.css';

type DropdownProps<T> = {
  items: T[];
  getKey: (item: T) => string;
  getLabel: (item: T) => string;
  selectedKey?: string | null;
  emptyLabel?: string;
  placeholder?: string;
  maxItems?: number;
  onSelect: (item: T) => void;
};

export function Dropdown<T>(
  {
    items,
    getKey,
    getLabel,
    selectedKey,
    emptyLabel = '',
    placeholder,
    maxItems = 100,
    onSelect,
  }: DropdownProps<T>,
) {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const [filtered, totalCount] = useMemo(() => {
    const terms = search
      .toLowerCase()
      .split(/\s+/)
      .filter((term) => !!term);
    const matches = items.filter((item) => {
      const label = getLabel(item).toLowerCase();
      return terms.every((t) => label.includes(t));
    });
    return [matches.slice(0, maxItems), matches.length];
  }, [items, search, maxItems, getLabel]);

  const selected = items.find((item) => getKey(item) === selectedKey);
  const selectedLabel = selected ? getLabel(selected) : emptyLabel;

  return (
    <div className="dropdown">
      <input
        title={selectedLabel}
        type="text"
        value={open ? search : selectedLabel}
        placeholder={placeholder}
        onFocus={() => {
          setOpen(true);
          setSearch('');
        }}
        onBlur={() => {
          setTimeout(() => setOpen(false), 150);
        }}
        onChange={(e) => setSearch(e.target.value)}
      />
      {open && (
        <ul>
          {filtered.map((item) => (
            <DropdownItem
              key={getKey(item)}
              isSelected={getKey(item) === selectedKey}
              onSelect={() => {
                onSelect(item);
                setOpen(false);
              }}
            >
              {getLabel(item)}
            </DropdownItem>
          ))}
          {totalCount > maxItems && (
            <li className="more-info">
              Showing {maxItems} of {totalCount}...
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

type DropdownItemProps = {
  isSelected: boolean;
  onSelect: () => void;
  children: ReactNode;
};

function DropdownItem({ isSelected, onSelect, children }: DropdownItemProps) {
  return (
    <li
      className={isSelected ? 'selected' : ''}
      onMouseDown={onSelect}
    >
      {children}
    </li>
  );
}