import { findByPath, getContent, type LinkedArtNode, url } from '@globalise/common';

export function getPersonPlaces(person: LinkedArtNode): LinkedArtNode[] {
  const places = new Map<string, LinkedArtNode>();
  const add = (node: LinkedArtNode) => {
    const uri = url(node);
    if (node.type === 'Place' && uri) {places.set(uri, node);}
  };
  for (const key of ['born', 'died']) {
    for (const event of findByPath(person, [key])) {
      for (const place of findByPath(event, ['took_place_at'])) {add(place);}
    }
  }
  for (const key of Object.keys(person).filter((key) => key.endsWith('_subject_of'))) {
    for (const claim of findByPath(person, [key])) {
      for (const place of findByPath(claim, ['ascribes_residence_place'])) {add(place);}
      for (const place of findByPath(claim, ['has_geographic_scope'])) {add(place);}
    }
  }
  return [...places.values()];
}

// Read the place dataset's explicit latitude/longitude types, not embedded labels.
export function getPlaceCoordinates(place: LinkedArtNode): [number, number] | undefined {
  const expressions = [
    ...findByPath(place, ['place_is_defined_by']),
    ...findByPath(place, ['is_approximated_by_declarative_place', 'place_is_defined_by']),
  ];
  const values = (type: string) => [...new Set(expressions
    .filter((expression) => findByPath(expression, ['classified_as']).some((term) => term.id?.replace(/^http:/, 'https:') === `https://vocab.getty.edu/aat/${type}`))
    .map(getContent).filter((value) => value.trim() !== '').map(Number))];
  const latitudes = values('300387565');
  const longitudes = values('300387567');
  if (latitudes.length !== 1 || longitudes.length !== 1) {return;}
  const [latitude] = latitudes;
  const [longitude] = longitudes;
  return Number.isFinite(latitude) && Math.abs(latitude) <= 90 && Number.isFinite(longitude) && Math.abs(longitude) <= 180
    ? [longitude, latitude] : undefined;
}
