import { label as labelOf, url as urlOf, useMetadataNodes } from '@globalise/common';
import { EntityTag } from '@globalise/design';
import { toHref } from '@globalise/router';
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
        {types.map((type) => {
          const uri = urlOf(type);
          if (!uri?.startsWith('https://data.globalise.huygens.knaw.nl/hdl:20.500.14722/thesaurus:')) {
            return labelOf(type);
          }
          return <EntityTag type="concept" href={toHref({ to: '/object-card', search: { uri } })}>{labelOf(type)}</EntityTag>;
        })}
      </Joined>
    </Pair>
  );
}
