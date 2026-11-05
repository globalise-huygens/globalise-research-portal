import { useMetadataNodes } from '@globalise/common';
import { EmptyPair, Joined, LinkedArtRelation, Pair, PlaceTag } from '../common';
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
        {places.map((place, i) => (
          <LinkedArtRelation
            key={place.id ?? i}
            node={place}
            render={(placeLabel, href) => <PlaceTag label={placeLabel} href={href} />}
          />
        ))}
      </Joined>
    </Pair>
  );
}