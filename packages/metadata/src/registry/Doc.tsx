import { MetadataComponentProps } from './MetadataComponentProps.tsx';

export function Doc({ entry }: MetadataComponentProps) {
  return (
    <li className="document-item">{entry.url
      ? <a href={entry.url} target="_blank">{entry.value}</a>
      : entry.value
    }</li>
  );
}