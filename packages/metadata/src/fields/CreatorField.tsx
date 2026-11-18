import { label as labelOf, useMetadataNodes } from '@globalise/common';
import { EmptyPair, Joined, Pair } from '../common';
import type { FieldProps } from './FieldProps';

export function CreatorField({
  url,
  label = 'Creator',
  fallback,
  path = ['produced_by', 'carried_out_by'],
}: FieldProps) {
  const creators = useMetadataNodes(url, path);
  if (!creators.length) {
    return <EmptyPair label={label} fallback={fallback}/>;
  }
  return (
    <Pair label={label}>
      <Joined>
        {creators.map((creator) => labelOf(creator))}
      </Joined>
    </Pair>
  );
}