import { useMetadataValues } from '@globalise/common';
import { EmptyPair, Joined, Pair } from '../common';
import type { FieldProps } from './FieldProps';

export function TitlesField({
  url,
  label = 'Titles(s)',
  fallback,
  path = ['title', 'content'],
}: FieldProps) {
  const titles = useMetadataValues(url, path);
  if (!titles.length) {
    return <EmptyPair label={label} fallback={fallback}/>;
  }
  return (
    <Pair label={label}>
      <Joined>
        {titles}
      </Joined>
    </Pair>
  );
}