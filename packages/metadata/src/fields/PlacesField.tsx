import { url as urlOf, useMetadataNodes } from '@globalise/common';
import { EmptyPair, Joined, Pair, PlaceTag } from '../common';
import type { FieldProps } from './FieldProps';

export function PlacesField({
  url,
  label = 'Location(s)',
  fallback,
  path = ['produced_by', 'took_place_at'],
}: FieldProps) {

  const places = useMetadataNodes(url, path)
    .map((place) => ({ label: place._label ?? '', href: urlOf(place) }));
  if (!places.length) {
    return <EmptyPair label={label} fallback={fallback}/>;
  }
  return (
    <Pair label={label}>
      <Joined>
        {places.map((place, i) => <PlaceTag key={i} {...place}/>)}
      </Joined>
    </Pair>
  );
}