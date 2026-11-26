import { label as labelOf, url as urlOf, useMetadataNodes } from '@globalise/common';
import { RelationLink } from '@globalise/object-card';
import { thesaurusBase } from '@globalise/common/uri';
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
        {types.map((type, index) => {
          const uri = urlOf(type);
          const typeLabel = labelOf(type);
          if (!uri?.startsWith(thesaurusBase)) {
            return typeLabel;
          }
          return (
            <RelationLink
              key={`${uri}-${index}`}
              node={type}
              label={typeLabel}
              previewOnDemand
            />
          );
        })}
      </Joined>
    </Pair>
  );
}
