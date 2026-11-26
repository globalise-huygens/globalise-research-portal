import {
  findByPath,
  getEntityTitle,
  type LinkedArtNode,
} from '@globalise/common';
import { getPersonNameRecords } from '../PersonStatusModel.ts';
import { PlaceValues } from './PlaceValues.tsx';

export function PlaceOverview({ entity }: { entity: LinkedArtNode }) {
  const title = getEntityTitle(entity);
  const recordedNames = getPersonNameRecords(entity).map(({ name }) => name);
  const names = [...new Set(recordedNames)].filter((name) => name !== title);
  const certainty = findByPath(entity, [
    'is_approximated_by_declarative_place',
    'classified_as',
  ]);
  if (!names.length && !certainty.length) {
    return null;
  }
  return <div className="person-overview">
    {!!names.length && <span className="person-overview-fact">
      also: {names.join(', ')}
    </span>}
    {!!certainty.length && <span className="person-overview-fact">
      <PlaceValues values={certainty} linked={false} />
    </span>}
  </div>;
}
