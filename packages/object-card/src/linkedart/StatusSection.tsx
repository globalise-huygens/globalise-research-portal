import { ObjectCardSection } from '@globalise/design';
import { findStatuses, LinkedArtNode, Status, getStatusLabel } from '@globalise/common';
import { LabeledKey } from './LabeledKey.ts';
import { RelationLink } from './RelationLink.tsx';
import { SourceList } from './SourceList.tsx';
import { TimespanValue } from './TimespanValue.tsx';

type StatusSectionProps = {
  entity: LinkedArtNode;
  labeledKey: LabeledKey;
};

export function StatusSection({ entity, labeledKey }: StatusSectionProps) {
  const statuses = findStatuses(entity, labeledKey.key);
  if (!statuses.length) {
    return <ObjectCardSection title={labeledKey.label} className="inactive"/>;
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
  status: Status;
};

function StatusItem({ status }: StatusItemProps) {
  return (
    <li>
      <span className="status-label">{getStatusLabel(status)}</span>
      {!!status.scope.length && (
        <span className="status-scope">
          {status.scope.map((node, i) => <RelationLink key={i} node={node}/>)}
        </span>
      )}
      {status.timespan && (
        <span className="status-timespan">
          <TimespanValue timespan={status.timespan}/>
        </span>
      )}
      <SourceList sources={status.sources}/>
    </li>
  );
}
