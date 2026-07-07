import { RegistryComponentProps } from '../RegistryComponent.tsx';
import { RegistryComponent } from '../RegistryComponent.tsx';
import { Label } from '../Label.tsx';

export function Li({ entry }: RegistryComponentProps) {
  const { metadata } = entry;
  return (
    <li className="metadata-entry">
      <Label label={metadata.label}/>
      <span className="value">{metadata.value}</span>
      {!!metadata.url && <> (<a href={metadata.url} target="_blank">view</a>)</>}
      {!!entry.children.length && (
        <ul>{entry.children.map((child, i) =>
          <RegistryComponent key={i} entry={child} />)
        }</ul>
      )}
    </li>
  );
}