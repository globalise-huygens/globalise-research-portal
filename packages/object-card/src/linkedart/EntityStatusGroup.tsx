import { findByPath, findTimespan, getRecordedDates, getStatusValues, isLinkedArtNode, type LinkedArtNode, type RecordedDates, type StatusValue } from '@globalise/common';
import { ObjectCardDisclosure, ObjectCardProperty, ObjectCardPropertyList, ObjectCardSection } from '@globalise/design';
import type { ReactNode } from 'react';
import { StatusValues } from './StatusValues.tsx';
import { RecordedDatesValue } from './RecordedDatesValue.tsx';
import { TimespanValue } from './TimespanValue.tsx';
import { RelationValue } from './RelationLink.tsx';
import { getNotes, isVisibleSource, SourceList } from './SourceList.tsx';
import { getStatusProperties, type StatusProperty, type StatusGroup } from './LabeledKey.ts';
import { getResidenceLabel, groupEntityStatuses } from './EntityStatusModel.ts';

export function StatusRecordCount({ count }: { count: number }) {
  return count > 1 ? <span className="person-status-count">{count} records</span> : null;
}

export function StatusRecordLabel({ index }: { index: number }) {
  return <div className="person-status-label">Record {index + 1}</div>;
}

type EntityStatusGroupProps = {
  children?: ReactNode;
  entity: LinkedArtNode;
  group: StatusGroup;
  section?: boolean;
};

export function EntityStatusGroup({
  entity,
  group,
  section = true,
  children,
}: EntityStatusGroupProps) {
  const statuses = getStatusNodes(entity, group)
    .filter((status) => hasStatusValues(status, group));
  const additionalNodes = getAdditionalStatusNodes(entity, group);
  const isOccupationGroup = group.type === 'SocialStatus';
  if (!children && !statuses.length && !additionalNodes.length) {
    return null;
  }

  const content = groupEntityStatuses(statuses).map(({ key, records }, index) => {
    const status = records[0];
    const dateKey = (node: LinkedArtNode) => JSON.stringify([
      findTimespan(node), getRecordedDates(node),
    ]);
    const statusDates = dateKey(status);
    const sharedDates = records.every((record) => dateKey(record) === statusDates);
    const timespan = sharedDates ? findTimespan(status) : null;
    const recordedDates = sharedDates && !timespan ? getRecordedDates(status) : null;
    const summaryProperties = getStatusProperties(status);
    const details = records.some((record) => hasStatusDetails(record, group)) ? records : [];

    return (
      <ObjectCardDisclosure
        key={key}
        className={isOccupationGroup ? 'person-occupation-status' : undefined}
        defaultExpanded={section && index === 0}
        summary={(
          <>
            <EntityStatusSummary
              group={group}
              properties={summaryProperties}
              recordedDates={recordedDates}
              timespan={timespan}
            />
            {!sharedDates && records.map((record, recordIndex) => {
              const recordTimespan = findTimespan(record);
              const recordDates = recordTimespan ? null : getRecordedDates(record);
              return (
                <div key={recordIndex} className="person-status-summary-date">
                  <StatusRecordLabel index={recordIndex} />
                  {recordTimespan
                    ? <TimespanValue timespan={recordTimespan} mode="summary" />
                    : recordDates
                      ? <RecordedDatesValue dates={recordDates} />
                      : 'Date: not recorded'}
                </div>
              );
            })}
            <StatusRecordCount count={records.length} />
          </>
        )}
      >
        {details.length > 0 ? details.map((record, recordIndex) => (
          <div key={recordIndex} className="person-status-record">
            {records.length > 1 && <StatusRecordLabel index={recordIndex} />}
            <ObjectCardPropertyList className="person-status-details">
              <StatusValuesProperty label="Geographic scope" values={getStatusValues(record, ['has_geographic_scope'])} />
              <StatusValuesProperty label="Classification" values={getStatusValues(record, ['classified_as'])} />
              <NotesProperty node={record} />
              <SourcesProperty className={isOccupationGroup ? 'person-status-sources' : undefined} node={record} />
            </ObjectCardPropertyList>
          </div>
        )) : null}
      </ObjectCardDisclosure>
    );
  });
  return section ? (
    <ObjectCardSection title={group.label} collapsible>
      <div className="person-status-list">
        {children}
        {content}
        <UnassignedStatusInformation nodes={additionalNodes} />
      </div>
    </ObjectCardSection>
  ) : <>{children}{content}<UnassignedStatusInformation nodes={additionalNodes} /></>;
}

function UnassignedStatusInformation({ nodes }: { nodes: LinkedArtNode[] }) {
  const sources = nodes.filter((node) => node.type === 'LinguisticObject' && isVisibleSource(node, true, true));
  const places = nodes.filter((node) => node.type === 'Place');
  const terms = nodes.filter((node) => node.type === 'Type');
  const other = nodes.filter((node) => !['LinguisticObject', 'Place', 'Type'].includes(node.type));
  if (!sources.length && !places.length && !terms.length && !other.length) {
    return null;
  }
  return (
    <ObjectCardDisclosure summary={<span className="person-status-summary-label">Other recorded information</span>}>
      <p className="person-status-note">This information is recorded separately from individual status records.</p>
      <ObjectCardPropertyList className="person-status-details">
        <StatusValuesProperty label="Places mentioned" values={places} />
        <StatusValuesProperty label="Recorded terms" values={terms} />
        <StatusValuesProperty label="Other values" values={other} />
        {!!sources.length && (
          <ObjectCardProperty label="Sources" value={<SourceList sources={sources} includeInternalLabels showNotes />} />
        )}
      </ObjectCardPropertyList>
    </ObjectCardDisclosure>
  );
}

type EntityStatusSummaryProps = {
  group: StatusGroup;
  properties: (StatusProperty & { values: StatusValue[] })[];
  recordedDates: RecordedDates | null;
  timespan: ReturnType<typeof findTimespan>;
};

function EntityStatusSummary({
  group,
  properties,
  recordedDates,
  timespan,
}: EntityStatusSummaryProps) {
  const isOccupation = group.type === 'SocialStatus';
  const connection = group.type === 'ResidentialStatus'
    ? properties.find((property) => property.keys.includes('ascribes_residence_relation'))
    : undefined;
  const place = properties.find((property) => property.keys.includes('ascribes_residence_place'));
  const renderProperties = (displayedProperties: typeof properties) => displayedProperties.length
    ? displayedProperties.map((property, index) => (
      <EntitySummaryProperty
        key={property.label}
        label={isOccupation && index === 0 ? undefined : property.label}
        value={<StatusValues values={property.values} linked={property.linked} stacked={property.stacked} />}
      />
    ))
    : isOccupation && (timespan || recordedDates)
      ? null
      : <span className="person-status-summary-label">{isOccupation ? 'Status details' : group.label}</span>;
  const renderConnection = (text: string) => {
    const residenceLabel = getResidenceLabel([text]);
    return residenceLabel && place
      ? renderProperties([{ ...place, label: residenceLabel }])
      : renderProperties(properties);
  };
  return (
    <div className="person-status-summary-content">
      {timespan && (
        <span className="person-status-summary-date">
          <TimespanValue timespan={timespan} mode="summary" />
        </span>
      )}
      {recordedDates && <RecordedDatesValue dates={recordedDates} />}
      {connection?.values.length === 1 && place
        ? isLinkedArtNode(connection.values[0])
          ? <RelationValue node={connection.values[0]} render={renderConnection} />
          : renderConnection(connection.values[0])
        : renderProperties(properties)}
    </div>
  );
}

type EntitySummaryPropertyProps = {
  label?: string;
  value?: ReactNode;
};

export function EntitySummaryProperty({ label: propertyLabel, value }: EntitySummaryPropertyProps) {
  if (!value) {
    return null;
  }
  return (
    <span className="person-status-summary-property">
      {propertyLabel && (
        <span className="person-status-summary-label">{propertyLabel}: </span>
      )}
      <span className="person-status-summary-value">{value}</span>
    </span>
  );
}

export function hasStatusEvidence(status: LinkedArtNode, includeSources = true): boolean {
  return getStatusValues(status, ['classified_as']).length > 0
    || includeSources && getVisibleSources(status).length > 0
    || getNotes(status).length > 0;
}

function hasStatusDetails(status: LinkedArtNode, _group: StatusGroup, includeSources = true): boolean {
  return getStatusValues(status, ['has_geographic_scope']).length > 0
    || hasStatusEvidence(status, includeSources);
}

function getAdditionalStatusNodes(entity: LinkedArtNode, group: StatusGroup) {
  return findByPath(entity, [group.key]).filter((node) => node.type !== group.type
    && (node.type !== 'LinguisticObject' || isVisibleSource(node, true, true)));
}

export function hasGroupInformation(entity: LinkedArtNode, group: StatusGroup) {
  return getStatusNodes(entity, group).some((status) => hasStatusValues(status, group))
    || getAdditionalStatusNodes(entity, group).length > 0;
}

export function hasStatusValues(status: LinkedArtNode, group: StatusGroup): boolean {
  return getStatusProperties(status).length > 0 || hasStatusDetails(status, group, group.type !== 'ResidentialStatus')
    || !!findTimespan(status)
    || !!getRecordedDates(status);
}

export function getStatusNodes(
  entity: LinkedArtNode,
  definition: Pick<StatusGroup, 'key' | 'type'>,
): LinkedArtNode[] {
  return findByPath(entity, [definition.key]).filter(
    (status) => status.type === definition.type,
  );
}

type StatusValuesPropertyProps = {
  className?: string;
  label: string;
  linked?: boolean;
  stacked?: boolean;
  values: StatusValue[];
};

export function StatusValuesProperty({
  className,
  label: propertyLabel,
  linked,
  stacked,
  values,
}: StatusValuesPropertyProps) {
  if (!values.length) {
    return null;
  }
  return (
    <ObjectCardProperty
      className={className}
      label={propertyLabel}
      value={<StatusValues values={values} linked={linked} stacked={stacked} />}
    />
  );
}

export function SourcesProperty({
  className,
  node,
}: {
  className?: string;
  node: LinkedArtNode;
}) {
  const sources = getVisibleSources(node);
  if (!sources.length) {
    return null;
  }
  return (
    <ObjectCardProperty
      className={className}
      label="Sources"
      value={(
        <SourceList
          includeInternalLabels
          showNotes
          sources={sources}
        />
      )}
    />
  );
}

export function getVisibleSources(node: LinkedArtNode): LinkedArtNode[] {
  return findByPath(node, ['referred_to_by'])
    .filter((source) => isVisibleSource(source, true, true));
}

export function NotesProperty({ node }: { node: LinkedArtNode }) {
  const notes = getNotes(node);
  if (!notes.length) {
    return null;
  }
  return (
    <ObjectCardProperty
      label="Notes"
      value={<StatusValues linked={false} stacked values={notes} />}
    />
  );
}
