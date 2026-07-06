import { MetadataComponentProps } from './MetadataComponentProps.tsx';

export function Li({ entry }: MetadataComponentProps) {
  return (
    <li className="metadata-entry">
      <span className="label" style={{ color: 'grey' }}>{entry.label}: </span>
      <span className="value">{entry.value}</span>
      {!!entry.url && <> (<a href={entry.url} target="_blank">view</a>)</>}
      {!!entry.children.length && (
        <ul>
          {entry.children.map((child, i) => (
            <Li key={i} entry={child} />
          ))}
        </ul>
      )}
    </li>
  );
}