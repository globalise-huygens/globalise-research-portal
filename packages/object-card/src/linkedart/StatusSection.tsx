import { ObjectCardSection } from '@globalise/design';
import { findByPath, findTimespan, getStatusLabel, LinkedArtNode } from '@globalise/common';
import { LabeledKey } from './LabeledKey.ts';
import { RelationLink } from './RelationLink.tsx';
import { SourceList } from './SourceList.tsx';
import { TimespanValue } from './TimespanValue.tsx';

type StatusSectionProps = {
  entity: LinkedArtNode;
  labeledKey: LabeledKey;
};

export function StatusSection({ entity, labeledKey }: StatusSectionProps) {
  const statuses = findByPath(entity, [labeledKey.key]);
  if (!statuses.length) {
    return null;
  }
  return (
    <ObjectCardSection title={labeledKey.label}>
      <ul className="status-list">
        {statuses.map((status, i) => <StatusItem key={i} status={status}/>)}
      </ul>
    </ObjectCardSection>
  );
}

type StatusItemProps = {
  status: LinkedArtNode;
};

function StatusItem({ status }: StatusItemProps) {
  const scope = findByPath(status, ['has_geographic_scope']);
  const timespan = findTimespan(status);
  return (
    <li>
      <span className="status-label">{getStatusLabel(status)}</span>
      {!!scope.length && (
        <span className="status-scope">
          {scope.map((node, i) => <RelationLink key={i} node={node}/>)}
        </span>
      )}
      {timespan && (
        <span className="status-timespan">
          <TimespanValue timespan={timespan}/>
        </span>
      )}
      <SourceList sources={findByPath(status, ['referred_to_by'])}/>
    </li>
  );
}
