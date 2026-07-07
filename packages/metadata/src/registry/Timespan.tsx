import { MetadataComponentProps } from './MetadataComponentProps.tsx';
import { MetadataEntry } from '../MetadataModel.ts';

export function Timespan({ entry }: MetadataComponentProps) {
  const begin = childValue(entry, 'begin_of_the_begin');
  const end = childValue(entry, 'end_of_the_end');
  return (
    <li className="metadata-entry">
      <EntryLabel label={entry.label}/>
      <span
        className="value"
      >
        <span title={begin}>{formatDate(begin)}</span>
        &nbsp;&ndash;&nbsp;
        <span title={end}>{formatDate(end)}</span>
      </span>
    </li>
  );
}

function childValue(entry: MetadataEntry, propName: string): string | undefined {
  return entry.children.find((c) => c.source.propName === propName)?.value;
}

function formatDate(value?: string): string {
  if (!value) {
    return '?';
  }
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export type EntryLabelProps = { label: string };

export function EntryLabel({ label }: EntryLabelProps) {
  return <span className="label" style={{ color: 'grey' }}>{label}: </span>;
}