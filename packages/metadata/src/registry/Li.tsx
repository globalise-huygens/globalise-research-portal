import { MetadataComponentProps } from './MetadataComponentProps.tsx';
import { componentRegistry } from './componentRegistry.ts';
import { matchRule } from '../matchRule.ts';
import { metadataConfig } from '../metadataConfig.ts';
import { EntryLabel } from './Timespan.tsx';

export function Li({ entry }: MetadataComponentProps) {
  return (
    <li className="metadata-entry">
      <EntryLabel label={entry.label}/>
      <span className="value">{entry.value}</span>
      {!!entry.url && <> (<a href={entry.url} target="_blank">view</a>)</>}
      {!!entry.children.length && (
        <ul>
          {entry.children.map((child, i) => {
            const componentName = matchRule(child, metadataConfig)?.component;
            const Component = componentRegistry[componentName ?? 'default'];
            return <Component key={i} entry={child} />;
          })}
        </ul>
      )}
    </li>
  );
}