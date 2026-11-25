import {
  getLinkedArtEntityType, url as urlOf, useMetadataNodes,
} from '@globalise/common';
import { isInternalUri, RelationLink } from '@globalise/object-card';
import { EmptyPair, Joined, Pair, PlaceTag } from '../common';
import type { FieldProps } from './FieldProps';

export function PlacesField({
  url,
  label = 'Location(s)',
  fallback,
  path = ['produced_by', 'took_place_at'],
}: FieldProps) {

  const places = useMetadataNodes(url, path);
  if (!places.length) {
    return <EmptyPair label={label} fallback={fallback}/>;
  }
  return (
    <Pair label={label}>
      <Joined>
        {places.map((place, index) => {
          const href = urlOf(place);
          const placeLabel = place._label ?? '';
          const key = `${href ?? placeLabel}-${index}`;
          if (isInternalUri(href) && getLinkedArtEntityType(href) === 'place') {
            return (
              <RelationLink
                key={key}
                node={place}
                label={placeLabel}
                previewOnDemand
              />
            );
          }
          return <PlaceTag key={key} label={placeLabel} href={href}/>;
        })}
      </Joined>
    </Pair>
  );
}
