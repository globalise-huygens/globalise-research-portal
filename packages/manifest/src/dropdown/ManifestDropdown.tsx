import { ManifestEntry } from './ManifestEntry.tsx';
import { Dropdown } from './Dropdown.tsx';

type ManifestDropdownProps = {
  manifests: ManifestEntry[];
  selected: string;
  onChange: (url: string) => void;
};

export function ManifestDropdown(
  { manifests, selected, onChange }: ManifestDropdownProps,
) {
  return (
    <Dropdown
      items={manifests}
      getKey={(m) => m.id}
      getLabel={(m) => m.label}
      selectedKey={selected}
      emptyLabel={selected}
      placeholder="Search manifests..."
      onSelect={(m) => onChange(m.id)}
    />
  );
}