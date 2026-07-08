import { RegistryComponentProps } from '../RegistryComponent.tsx';
import { RegistryComponent } from '../RegistryComponent.tsx';
import { Label } from '../Label.tsx';
import {IconDataObject, IconOpenInNew} from '@globalise/design';

export function Li({ entry }: RegistryComponentProps) {
  const { metadata } = entry;
  return (
    <li className="metadata-entry">
      <Label label={metadata.label}/>
      <span className="value">{metadata.value}</span>
      &nbsp;
      <span className="source" title={JSON.stringify(metadata.source, null, 2)}>
        <IconDataObject />
      </span>
      {!!metadata.url && <> <a className="metadata-url" href={metadata.url} target="_blank">
        <IconOpenInNew />
      </a></>}
      {!!entry.children.length && (
        <ul>{entry.children.map((child, i) =>
          <RegistryComponent key={i} entry={child} />)
        }</ul>
      )}
    </li>
  );
}