import {url, useMetadataNodes} from '@globalise/common';
import {Joined, Pair, PlaceTag} from '../common';

export function PlacesField() {
  const label = 'Location(s)';

  const places = useMetadataNodes(['produced_by', 'took_place_at'])
    .map((place) => ({ label: place._label ?? '', href: url(place) }));
  if (!places.length) {
    return null;
  }
  return (
    <Pair label={label}>
      <Joined>
        {places.map((place, i) => <PlaceTag key={i} {...place}/>)}
      </Joined>
    </Pair>
  );
}
