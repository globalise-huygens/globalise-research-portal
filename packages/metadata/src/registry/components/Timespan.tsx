import { RegistryComponentProps } from '../RegistryComponent.tsx';
import { findChild } from '../../findChild.tsx';
import { Label } from '../Label.tsx';

export function Timespan({ entry }: RegistryComponentProps) {
  const { metadata } = entry;
  const begin = findChild(metadata, 'begin_of_the_begin')?.value;
  const end = findChild(metadata, 'end_of_the_end')?.value;
  return (
    <li className="metadata-entry">
      <Label label={metadata.label}/>
      <span className="value">
        <span title={begin}>{formatDate(begin)}</span>
        &nbsp;&ndash;&nbsp;
        <span title={end}>{formatDate(end)}</span>
      </span>
    </li>
  );
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
