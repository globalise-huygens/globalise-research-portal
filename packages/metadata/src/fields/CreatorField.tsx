import { label as labelOf, useMetadataNodes } from '@globalise/common';
import { EmptyPair, Joined, Pair } from '../common';
import type { FieldProps } from './FieldProps';

export function CreatorField({ url, label = 'Creator', fallback }: FieldProps) {
  const creators = useMetadataNodes(url, ['produced_by', 'carried_out_by']);
  if (!creators.length) {
    return <EmptyPair label={label} fallback={fallback}/>;
  }
  return (
    <Pair label={label}>
      <Joined>
        {creators.map(labelOf)}
      </Joined>
    </Pair>
  );
}