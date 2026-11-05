import { useMetadataNodes } from '@globalise/common';
import { EmptyPair, Joined, LinkedArtRelation, Pair } from '../common';
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
        {types.map((type, i) => (
          <LinkedArtRelation key={type.id ?? i} node={type} />
        ))}
      </Joined>
    </Pair>
  );
}
