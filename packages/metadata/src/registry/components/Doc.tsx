import { RegistryComponentProps } from '../RegistryComponent.tsx';

export function Doc({ entry }: RegistryComponentProps) {
  const { metadata } = entry;
  return (
    <li className="document-item">{metadata.url
      ? <a href={metadata.url} target="_blank">{metadata.value}</a>
      : metadata.value
    }</li>
  );
}