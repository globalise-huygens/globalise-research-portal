import { label as labelOf, useMetadataNodes } from '@globalise/common';
import { EmptyPair, Joined, Pair } from '../common';
import type { FieldProps } from './FieldProps';

export function TypeField({
  url,
  label = 'Type',
  fallback,
  path = ['classified_as'],
}: FieldProps) {
  const types = useMetadataNodes(url, path);
  if (!types.length) {
    return <EmptyPair label={label} fallback={fallback}/>;
  }
  return (
    <Pair label={label}>
      <Joined>
        {types.map((type) => labelOf(type))}
      </Joined>
    </Pair>
  );
}