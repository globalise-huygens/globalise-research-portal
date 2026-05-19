import {useMemo, useState} from "react";
import {HeaderRegion} from "@globalise/common/header";
import {ManifestEntry} from "./ManifestEntry.tsx";

import './ManifestDropdown.css';

type ManifestDropdownProps = {
  manifests: ManifestEntry[];
  selected: string;
  onChange: (url: string) => void;
};

export function ManifestDropdown(
  {manifests, selected, onChange}: ManifestDropdownProps
) {
  const sliceLength = 20;
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const [filtered, totalCount] = useMemo(() => {
    const terms = search
      .toLowerCase()
      .split(/\s+/)
      .filter(term => !!term);
    const matches = manifests.filter(m => {
      const label = m.label.toLowerCase();
      return terms.every(t => label.includes(t));
    });
    return [matches.slice(0, sliceLength), matches.length];
  }, [manifests, search]);

  const selectedLabel = manifests
    .find(m => m.id === selected)?.label ?? selected;

  return (
    <div className="manifest-dropdown">
      <input
        title={selectedLabel}
        type="text"
        value={open ? search : selectedLabel}
        placeholder="Search manifests..."
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
          {filtered.map(m => (
            <li
              key={m.id}
              className={m.id === selected ? 'selected' : ''}
              onMouseDown={() => {
                onChange(m.id);
                setOpen(false);
              }}
            >
              {m.label}
            </li>
          ))}
          {totalCount > sliceLength && (
            <li
              className="more-info">Showing {sliceLength} of {totalCount}...</li>
          )}
        </ul>
      )}
    </div>
  );
}

