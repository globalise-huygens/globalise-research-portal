import { useMetadataValues } from '@globalise/common';
import { EmptyPair, Joined, Pair } from '../common';
import type { FieldProps } from './FieldProps';

export function TitlesField({ url, label = 'Titles(s)', fallback }: FieldProps) {
  const titles = useMetadataValues(url, ['title', 'content']);
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