import { isLinkedArtNode, type StatusValue } from '@globalise/common';
import { RelationLink, RelationValue } from '../RelationLink.tsx';

type PlaceValuesProps = {
  values: StatusValue[];
  linked?: boolean;
};

export function PlaceValues({ values, linked = true }: PlaceValuesProps) {
  return <>{values.map((value, index) => <span key={index}>
    {index > 0 && ', '}<PlaceValue value={value} linked={linked} />
  </span>)}</>;
}

type PlaceValueProps = {
  value: StatusValue;
  linked: boolean;
};

function PlaceValue({ value, linked }: PlaceValueProps) {
  if (!isLinkedArtNode(value)) {
    return <>{value}</>;
  }
  if (!linked) {
    return <RelationValue node={value} resolveExternal={false} />;
  }
  return <RelationLink node={value} resolveExternal={false} />;
}
