import {
  asArray,
  findByPath,
  findTimespan,
  getContent,
  getLinkedArtEntityType,
  getValue,
  getValues,
  isLinkedArtNode,
  label,
  LinkedArtNode,
} from '@globalise/common';
import {
  IconExpandSection,
  ObjectCardBody,
  ObjectCardPanel,
  ObjectCardProperty,
  ObjectCardPropertyList,
  ObjectCardSection,
  ReferencePanel,
} from '@globalise/design';
import { type ReactNode, useId, useState } from 'react';
import { RelationLink, RelationValue } from './RelationLink.tsx';
import { getNotes, isVisibleSource, SourceList } from './SourceList.tsx';
import { TimespanValue } from './TimespanValue.tsx';

type PersonCardBodyProps = {
  entity: LinkedArtNode;
};

type StatusProperty = {
  label: string;
  keys: string[];
  linked?: boolean;
  stacked?: boolean;
};

type StatusDefinition = {
  key: string;
  type: string;
  properties: StatusProperty[];
};

type StatusGroup = StatusDefinition & {
  title: string;
};

type StatusValue = LinkedArtNode | string;

const personNameDefinition: StatusDefinition = {
  key: 'is_appellative_subject_of',
  type: 'AppellativeStatus',
  properties: [],
};

const personStatusGroups: StatusGroup[] = [
  {
    title: 'Classifications',
    key: 'is_classificatory_subject_of',
    type: 'ClassificatoryStatus',
    properties: [
      { label: 'Classification', keys: ['ascribes_classification'] },
    ],
  },
  {
    title: 'Statuses and occupations',
    key: 'is_social_status_subject_of',
    type: 'SocialStatus',
    properties: [
      { label: 'Status or occupation', keys: ['ascribes_social_status'] },
      {
        label: 'In relation to',
        keys: ['ascribes_social_status_in_relation_to'],
      },
    ],
  },
  {
    title: 'Locations',
    key: 'is_residence_subject_of',
    type: 'ResidentialStatus',
    properties: [
      {
        label: 'Location type',
        keys: ['ascribes_residence_relation'],
      },
      { label: 'Place', keys: ['ascribes_residence_place'] },
    ],
  },
  {
    title: 'Relations',
    key: 'is_familial_subject_of',
    type: 'FamilyStatus',
    properties: [
      {
        label: 'Relationship',
        keys: ['ascribes_familial_relation'],
        linked: false,
      },
      { label: 'Person', keys: ['ascribes_relative'], stacked: true },
    ],
  },
  {
    title: 'Social relations',
    key: 'is_social_relation_subject_of',
    type: 'SocialRelationStatus',
    properties: [
      { label: 'Relationship', keys: ['ascribes_social_relation'] },
      { label: 'Group', keys: ['ascribes_social_relation_target'] },
    ],
  },
  {
    title: 'Similarity',
    key: 'is_similarity_subject_of',
    type: 'SimilarityStatus',
    properties: [
      { label: 'Entity', keys: ['ascribes_similarity_target'] },
      { label: 'Mode', keys: ['ascribes_similarity_mode'] },
    ],
  },
  {
    title: 'Memberships',
    key: 'is_membership_subject_of',
    type: 'MembershipStatus',
    properties: [
      { label: 'Membership type', keys: ['ascribes_membership_relation'] },
      { label: 'Group', keys: ['ascribes_group'] },
    ],
  },
  {
    title: 'Succession',
    key: 'is_successor_status_subject_of',
    type: 'SuccessorStatus',
    properties: [
      {
        label: 'Succession type',
        keys: ['ascribes_succession_relation'],
      },
      {
        label: 'Sovereignty',
        keys: ['ascribes_succeeded_sovereignty'],
      },
    ],
  },
  {
    title: 'Ownership',
    key: 'is_ownership_subject_of',
    type: 'OwnershipStatus',
    properties: [],
  },
  {
    title: 'Custody',
    key: 'is_custodial_subject_of',
    type: 'CustodialStatus',
    properties: [],
  },
];

export function PersonCardBody({ entity }: PersonCardBodyProps) {
  const notes = getNotes(entity);
  const sources = getVisibleSources(entity);
  const occupationGroup = personStatusGroups.find(
    (group) => group.type === 'SocialStatus',
  );
  const locationGroup = personStatusGroups.find(
    (group) => group.type === 'ResidentialStatus',
  );
  const profileGroups = personStatusGroups.filter(
    (group) => group !== occupationGroup && group !== locationGroup,
  );

  return (
    <ObjectCardBody>
      <ObjectCardPanel side="left">
        {occupationGroup && (
          <PersonStatusGroup entity={entity} group={occupationGroup} />
        )}
        {locationGroup && (
          <PersonStatusGroup
            entity={entity}
            group={locationGroup}
            title="Other places"
          />
        )}
        <ObjectCardSection title="Profile" collapsible>
          <div className="person-status-list">
            <PersonNameDetailsSection entity={entity} />
            <PersonEventSection
              entity={entity}
              property="born"
              title="Born"
            />
            <PersonEventSection
              entity={entity}
              property="died"
              title="Died"
            />
            {profileGroups.map((group) => (
              <PersonStatusGroup
                key={group.title}
                entity={entity}
                group={group}
                section={false}
              />
            ))}
            {!!notes.length && (
              <PersonDisclosure
                summary={<span className="person-status-summary-label">Notes</span>}
              >
                <span className="person-status-summary-value">
                  <StatusValues linked={false} stacked values={notes} />
                </span>
              </PersonDisclosure>
            )}
            {!!sources.length && (
              <PersonDisclosure
                summary={<span className="person-status-summary-label">Sources</span>}
              >
                <SourceList
                  includeInternalLabels
                  showNotes
                  sources={sources}
                />
              </PersonDisclosure>
            )}
          </div>
        </ObjectCardSection>
      </ObjectCardPanel>
      <ReferencePanel
        className="person-reference-panel"
        emptyState={(
          <p className="person-references-empty">
            References are not available yet.
          </p>
        )}
      />
    </ObjectCardBody>
  );
}

export function getPersonTitle(entity: LinkedArtNode): string {
  const [name] = getPersonNameRecords(entity).map((record) => record.name);
  return (
    [name, getContent(entity), entity.id, entity.type].find(
      (value) => !!value,
    ) ?? ''
  );
}

export function PersonOverview({ entity }: PersonCardBodyProps) {
  const names = [
    ...new Set(getPersonNameRecords(entity).map((record) => record.name)),
  ];
  const alternativeNames = names.slice(1);
  const classifications = getStatusNodes(entity, personStatusGroups[0])
    .flatMap((status) => getStatusValues(status, ['ascribes_classification']));
  const occupations = getStatusNodes(entity, personStatusGroups[1])
    .flatMap((status) => getStatusValues(status, ['ascribes_social_status']));
  const born = getEventTimespans(entity, 'born');
  const died = getEventTimespans(entity, 'died');

  if (
    !alternativeNames.length &&
    !classifications.length &&
    !occupations.length &&
    !born.length &&
    !died.length
  ) {
    return null;
  }
  return (
    <div className="person-overview">
      <PersonOverviewFact label="also" values={alternativeNames} />
      <PersonOverviewFact values={classifications} />
      <PersonOverviewTimespans label="born" timespans={born} />
      <PersonOverviewTimespans label="died" timespans={died} />
      <PersonOverviewFact values={occupations} />
    </div>
  );
}

type PersonOverviewFactProps = {
  label?: string;
  values: StatusValue[];
};

function PersonOverviewFact({ label: factLabel, values }: PersonOverviewFactProps) {
  if (!values.length) {
    return null;
  }
  return (
    <span className="person-overview-fact">
      {factLabel && <span className="person-overview-label">{factLabel}:</span>}
      <span className="person-overview-value">
        {values.map((value, index) => (
          <span key={index}>
            {index > 0 && ', '}
            {isLinkedArtNode(value) ? <RelationValue node={value} /> : value}
          </span>
        ))}
      </span>
    </span>
  );
}

type PersonOverviewTimespansProps = {
  label: string;
  timespans: NonNullable<ReturnType<typeof findTimespan>>[];
};

function PersonOverviewTimespans({
  label: factLabel,
  timespans,
}: PersonOverviewTimespansProps) {
  if (!timespans.length) {
    return null;
  }
  return (
    <span className="person-overview-fact">
      <span className="person-overview-label">{factLabel}:</span>
      <span className="person-overview-value">
        {timespans.map((timespan, index) => (
          <span key={index}>
            {index > 0 && ', '}
            <TimespanValue timespan={timespan} />
          </span>
        ))}
      </span>
    </span>
  );
}

function getEventTimespans(entity: LinkedArtNode, property: 'born' | 'died') {
  return findByPath(entity, [property])
    .map(findTimespan)
    .filter((timespan) => !!timespan);
}

function PersonNameDetailsSection({ entity }: PersonCardBodyProps) {
  const records = getPersonNameRecords(entity);
  if (!records.length) {
    return null;
  }
  const content = records.map(({ key, name, status }) => {
    const classificationValues = getStatusValues(status, ['classified_as']);
    const timespan = findTimespan(status);
    const statusSources = getVisibleSources(status);
    const notes = getNotes(status);
    const hasDetails = classificationValues.length > 0
      || !!timespan
      || statusSources.length > 0
      || notes.length > 0;

    return (
      <PersonDisclosure
        key={key}
        summary={(
          <PersonSummaryProperty
            label="Name"
            value={<span className="person-name-value">{name}</span>}
          />
        )}
      >
        {hasDetails && (
          <ObjectCardPropertyList className="person-status-details">
            <StatusValuesProperty
              label="Classification"
              values={classificationValues}
            />
            {timespan && (
              <ObjectCardProperty
                label="Date"
                value={<TimespanValue timespan={timespan} />}
              />
            )}
            <NotesProperty node={status} />
            <SourcesProperty node={status} />
          </ObjectCardPropertyList>
        )}
      </PersonDisclosure>
    );
  });
  return <>{content}</>;
}

type PersonEventSectionProps = {
  entity: LinkedArtNode;
  property: 'born' | 'died';
  title: string;
};

function PersonEventSection({
  entity,
  property,
  title,
}: PersonEventSectionProps) {
  const events = findByPath(entity, [property])
    .map((event) => ({
      event,
      locations: getStatusValues(event, ['took_place_at']),
      notes: getNotes(event),
      sources: getVisibleSources(event),
      timespan: findTimespan(event),
    }))
    .filter(({ locations, notes, sources, timespan }) =>
      locations.length || notes.length || sources.length || timespan,
    );
  if (!events.length) {
    return null;
  }

  const content = events.map(({
    event,
    locations,
    notes,
    sources,
    timespan,
  }, index) => (
    <PersonDisclosure
      key={index}
      summary={(
        <div className="person-status-summary-content">
          <PersonSummaryProperty
            label={title}
            value={timespan && <TimespanValue timespan={timespan} />}
          />
          {!!locations.length && (
            <PersonSummaryProperty
              label={getEventLocationLabel(locations)}
              value={<StatusValues values={locations} />}
            />
          )}
          {!timespan && !locations.length && (
            <span className="person-status-summary-label">{title}</span>
          )}
        </div>
      )}
    >
      {!!(notes.length || sources.length) && (
        <ObjectCardPropertyList className="person-status-details">
          <NotesProperty node={event} />
          <SourcesProperty node={event} />
        </ObjectCardPropertyList>
      )}
    </PersonDisclosure>
  ));
  return <>{content}</>;
}

function getEventLocationLabel(values: StatusValue[]): string {
  const types = new Set(
    values
      .filter(isLinkedArtNode)
      .map((value) => getLinkedArtEntityType(value.id))
      .filter((type) => type !== 'unknown'),
  );
  if (types.size !== 1) {
    return 'Location';
  }
  const [type] = types;
  return `${type.charAt(0).toUpperCase()}${type.slice(1)}`;
}

type PersonStatusGroupProps = {
  entity: LinkedArtNode;
  group: StatusGroup;
  section?: boolean;
  title?: string;
};

function PersonStatusGroup({
  entity,
  group,
  section = true,
  title = group.title,
}: PersonStatusGroupProps) {
  const statuses = getStatusNodes(entity, group)
    .filter((status) => hasStatusValues(status, group));
  const isOccupationGroup = group.type === 'SocialStatus';
  if (!statuses.length) {
    return null;
  }

  const content = statuses.map((status, index) => {
    const timespan = findTimespan(status);
    const recordedDates = timespan ? null : getRecordedDates(status);
    const summaryProperties = group.properties
      .map((property) => ({
        ...property,
        values: getStatusValues(status, property.keys),
      }))
      .filter((property) => property.values.length);
    const additionalProperties = getAdditionalStatusProperties(status, group);
    const geographicScope = getStatusValues(status, ['has_geographic_scope']);
    const classifications = getStatusValues(status, ['classified_as']);
    const statusSources = getVisibleSources(status);
    const notes = getNotes(status);
    const hasDetails = additionalProperties.length > 0
      || geographicScope.length > 0
      || classifications.length > 0
      || statusSources.length > 0
      || notes.length > 0;

    return (
      <PersonDisclosure
        key={index}
        className={isOccupationGroup ? 'person-occupation-status' : undefined}
        defaultExpanded={section && index === 0}
        summary={(
          <PersonStatusSummary
            group={group}
            properties={summaryProperties}
            recordedDates={recordedDates}
            timespan={timespan}
          />
        )}
      >
        {hasDetails && (
          <ObjectCardPropertyList className="person-status-details">
            {additionalProperties.map((property) => (
              <StatusValuesProperty
                key={property.key}
                label={property.label}
                values={property.values}
              />
            ))}
            <StatusValuesProperty
              label="Geographic scope"
              values={geographicScope}
            />
            <StatusValuesProperty
              label="Classification"
              values={classifications}
            />
            <NotesProperty node={status} />
            <SourcesProperty
              className={isOccupationGroup
                ? 'person-status-sources'
                : undefined}
              node={status}
            />
          </ObjectCardPropertyList>
        )}
      </PersonDisclosure>
    );
  });
  return section ? (
    <ObjectCardSection title={title} collapsible>
      <div className="person-status-list">{content}</div>
    </ObjectCardSection>
  ) : <>{content}</>;
}

type PersonStatusSummaryProps = {
  group: StatusGroup;
  properties: (StatusProperty & { values: StatusValue[] })[];
  recordedDates: RecordedDates | null;
  timespan: ReturnType<typeof findTimespan>;
};

function PersonStatusSummary({
  group,
  properties,
  recordedDates,
  timespan,
}: PersonStatusSummaryProps) {
  const isOccupation = group.type === 'SocialStatus';
  return (
    <div className="person-status-summary-content">
      {timespan && (
        <span className="person-status-summary-date">
          <TimespanValue timespan={timespan} />
        </span>
      )}
      {recordedDates && <RecordedDatesValue dates={recordedDates} />}
      {properties.length ? properties.map((property, index) => (
        <PersonSummaryProperty
          key={property.label}
          label={isOccupation && index === 0 ? undefined : property.label}
          value={(
            <StatusValues
              values={property.values}
              linked={property.linked}
              stacked={property.stacked}
            />
          )}
        />
      )) : (
        <span className="person-status-summary-label">{group.title}</span>
      )}
    </div>
  );
}

type PersonSummaryPropertyProps = {
  label?: string;
  value?: ReactNode;
};

function PersonSummaryProperty({ label: propertyLabel, value }: PersonSummaryPropertyProps) {
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

type PersonDisclosureProps = {
  children?: ReactNode;
  className?: string;
  defaultExpanded?: boolean;
  summary: ReactNode;
};

function PersonDisclosure({
  children,
  className,
  defaultExpanded = false,
  summary,
}: PersonDisclosureProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const contentId = useId();
  const summaryId = useId();
  const classes = `person-status${className ? ` ${className}` : ''}`;

  if (!children) {
    return (
      <div className={classes}>
        <div className="person-status-summary">{summary}</div>
      </div>
    );
  }

  return (
    <div className={classes}>
      <div className="person-status-header">
        <div id={summaryId} className="person-status-summary">{summary}</div>
        <button
          type="button"
          aria-controls={contentId}
          aria-expanded={isExpanded}
          aria-labelledby={summaryId}
          className="person-status-toggle"
          onClick={() => setIsExpanded((expanded) => !expanded)}
        >
          <IconExpandSection
            aria-hidden="true"
            className="person-status-toggle-icon"
          />
        </button>
      </div>
      <div
        id={contentId}
        hidden={!isExpanded}
        className="person-status-content"
      >
        {children}
      </div>
    </div>
  );
}

function hasStatusValues(status: LinkedArtNode, group: StatusGroup): boolean {
  return group.properties.some((property) =>
    getStatusValues(status, property.keys).length > 0,
  ) || getAdditionalStatusProperties(status, group).length > 0
    || getStatusValues(status, ['has_geographic_scope']).length > 0
    || getStatusValues(status, ['classified_as']).length > 0
    || !!findTimespan(status)
    || !!getRecordedDates(status)
    || getVisibleSources(status).length > 0
    || getNotes(status).length > 0;
}

function getStatusNodes(
  entity: LinkedArtNode,
  definition: Pick<StatusDefinition, 'key' | 'type'>,
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

function StatusValuesProperty({
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

function StatusValues({
  values,
  linked = true,
  stacked,
}: Pick<StatusValuesPropertyProps, 'values' | 'linked' | 'stacked'>) {
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

function SourcesProperty({
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

function getVisibleSources(node: LinkedArtNode): LinkedArtNode[] {
  return findByPath(node, ['referred_to_by'])
    .filter((source) => isVisibleSource(source, true));
}

function NotesProperty({ node }: { node: LinkedArtNode }) {
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

type RecordedDates = {
  starts: string[];
  ends: string[];
};

function getRecordedDates(node: LinkedArtNode): RecordedDates | null {
  if (!isLinkedArtNode(node.timespan)) {
    return null;
  }
  const starts = uniqueDates([
    ...getValues(node.timespan.begin_of_the_begin),
    ...getValues(node.timespan.end_of_the_begin),
  ]);
  const ends = uniqueDates([
    ...getValues(node.timespan.begin_of_the_end),
    ...getValues(node.timespan.end_of_the_end),
  ]);
  return starts.length || ends.length ? { starts, ends } : null;
}

function uniqueDates(dates: string[]): string[] {
  return [...new Set(dates.map(formatRecordedDate))];
}

function formatRecordedDate(date: string): string {
  return date.replace(
    /T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?/g,
    '',
  );
}

function RecordedDatesValue({ dates }: { dates: RecordedDates }) {
  return (
    <span className="person-status-summary-date timespan-boundaries">
      {!!dates.starts.length && (
        <span>Recorded starts: {dates.starts.join(', ')}</span>
      )}
      {!!dates.ends.length && (
        <span>Recorded ends: {dates.ends.join(', ')}</span>
      )}
    </span>
  );
}

function getStatusValues(node: LinkedArtNode, keys: string[]): StatusValue[] {
  for (const key of keys) {
    const values: StatusValue[] = [];
    for (const value of asArray(node[key])) {
      if (isLinkedArtNode(value)) {
        values.push(value);
      } else {
        values.push(...getValues(value));
      }
    }
    if (values.length) {
      return values;
    }
  }
  return [];
}

function getAdditionalStatusProperties(
  status: LinkedArtNode,
  group: StatusGroup,
) {
  const configuredKeys = new Set(
    group.properties.flatMap((property) => property.keys),
  );
  return Object.keys(status)
    .filter(
      (key) =>
        key.includes('ascribes_') &&
        !key.includes('_relation') &&
        !configuredKeys.has(key),
    )
    .map((key) => ({
      key,
      label: getPropertyLabel(key),
      values: getStatusValues(status, [key]),
    }))
    .filter((property) => property.values.length);
}

function getPropertyLabel(key: string): string {
  const prefix = 'ascribes_';
  const words = key
    .slice(key.indexOf(prefix) + prefix.length)
    .replaceAll('_', ' ');
  return `${words.charAt(0).toUpperCase()}${words.slice(1)}`;
}

function getStatusValueText(value: StatusValue): string {
  return typeof value === 'string'
    ? value
    : getContent(value) ||
        getValue(value.value) ||
        (value.type === 'Type' ? label(value) : '');
}

function getPersonNameRecords(entity: LinkedArtNode) {
  return getStatusNodes(entity, personNameDefinition)
    .flatMap((status, statusIndex) =>
      getStatusValues(status, [
        'ascribes_appellation',
        'aaao:ZP6_ascribes_appellation',
      ]).map((value, valueIndex) => ({
        key: `${status.id ?? statusIndex}-${valueIndex}`,
        name: getStatusValueText(value),
        status,
      })),
    )
    .filter((record) => !!record.name);
}
