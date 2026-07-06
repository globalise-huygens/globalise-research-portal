import { MetadataEntry } from './MetadataModel.ts';
import React from 'react';

type MetadataNodeProps = { entry: MetadataEntry };

export function MetadataListItem({ entry }: MetadataNodeProps) {
  return (
    <li className="metadata-entry">
      <span className="label">{entry.label}: </span>
      <span className="value">{entry.value}</span>
      {entry.url && <> (<a href={entry.url} target="_blank">view</a>)</>}
      {entry.children && entry.children.length > 0 && (
        <ul>
          {entry.children.map((child, index) => (
            <MetadataListItem key={index} entry={child}/>
          ))}
        </ul>
      )}
    </li>
  );
}