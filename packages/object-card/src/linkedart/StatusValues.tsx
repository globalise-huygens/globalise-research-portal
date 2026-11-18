import { isLinkedArtNode, type StatusValue } from '@globalise/common';
import { RelationLink, RelationValue } from './RelationLink.tsx';

export function StatusValues({
  values,
  linked = true,
  stacked,
}: { values: StatusValue[]; linked?: boolean; stacked?: boolean }) {
  return (
    <span className={`person-status-values${stacked ? ' stacked' : ''}`}>
      {values.map((value, index) => (
        <span key={index}>
          {!stacked && index > 0 && ', '}
          {isLinkedArtNode(value)
            ? linked
              ? <RelationLink node={value} />
              : <RelationValue node={value} />
            : value}
        </span>
      ))}
    </span>
  );
}
