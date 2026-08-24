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
  ObjectCardBody,
  ObjectCardPanel,
  ObjectCardProperty,
  ObjectCardPropertyList,
  ObjectCardSection,
} from '@globalise/design';
import { RelationLink, RelationValue } from './RelationLink.tsx';
import { isVisibleSource, SourceList } from './SourceList.tsx';
import { TimespanValue } from './TimespanValue.tsx';

type PersonCardBodyProps = {
  entity: LinkedArtNode;
};

type StatusProperty = {
  label: string;
  keys: string[];
};

type StatusDefinition = {
  key: string;
  type: string;
  properties: StatusProperty[];
};

type StatusGroup = StatusDefinition & {
  title: string;
  column: 'left' | 'right';
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
    column: 'left',
    key: 'is_classificatory_subject_of',
    type: 'ClassificatoryStatus',
    properties: [
      { label: 'Classification', keys: ['ascribes_classification'] },
    ],
  },
  {
    title: 'Statuses and occupations',
    column: 'right',
    key: 'is_social_status_subject_of',
    type: 'SocialStatus',
    properties: [
      { label: 'Status or occupation', keys: ['ascribes_social_status'] },
    ],
  },
  {
    title: 'Locations',
    column: 'right',
    key: 'is_residence_subject_of',
    type: 'ResidentialStatus',
    properties: [{ label: 'Place', keys: ['ascribes_residence_place'] }],
  },
  {
    title: 'Relations',
    column: 'right',
    key: 'is_familial_subject_of',
    type: 'FamilyStatus',
    properties: [{ label: 'Person', keys: ['ascribes_relative'] }],
  },
  {
    title: 'Social relations',
    column: 'right',
    key: 'is_social_relation_subject_of',
    type: 'SocialRelationStatus',
    properties: [{ label: 'Group', keys: ['ascribes_social_relation_target'] }],
  },
  {
    title: 'Similarity',
    column: 'right',
    key: 'is_similarity_subject_of',
    type: 'SimilarityStatus',
    properties: [
      { label: 'Entity', keys: ['ascribes_similarity_target'] },
      { label: 'Mode', keys: ['ascribes_similarity_mode'] },
    ],
  },
  {
    title: 'Memberships',
    column: 'right',
    key: 'is_membership_subject_of',
    type: 'MembershipStatus',
    properties: [{ label: 'Group', keys: ['ascribes_group'] }],
  },
  {
    title: 'Ownership',
    column: 'right',
    key: 'is_ownership_subject_of',
    type: 'OwnershipStatus',
    properties: [],
  },
  {
    title: 'Custody',
    column: 'right',
    key: 'is_custodial_subject_of',
    type: 'CustodialStatus',
    properties: [],
  },
];

export function PersonCardBody({ entity }: PersonCardBodyProps) {
  const sources = findByPath(entity, ['referred_to_by'])
    .filter(isVisibleSource);

  return (
    <ObjectCardBody>
      <ObjectCardPanel side="left">
        <PersonNameDetailsSection entity={entity} />
        {personStatusGroups
          .filter((group) => group.column === 'left')
          .map((group) => (
            <PersonStatusGroup
              key={group.title}
              entity={entity}
              group={group}
            />
          ))}
        <PersonEventSection entity={entity} property="born" title="Born" />
        <PersonEventSection entity={entity} property="died" title="Died" />
        {!!sources.length && (
          <ObjectCardSection title="Sources">
            <SourceList sources={sources} />
          </ObjectCardSection>
        )}
      </ObjectCardPanel>
      <ObjectCardPanel side="right">
        {personStatusGroups
          .filter((group) => group.column === 'right')
          .map((group) => (
            <PersonStatusGroup
              key={group.title}
              entity={entity}
              group={group}
            />
          ))}
      </ObjectCardPanel>
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
  return (
    <ObjectCardSection title="Names">
      <div className="person-status-list">
        {records.map(({ key, name, status }) => (
          <ObjectCardPropertyList key={key} className="person-status">
            <ObjectCardProperty
              label="Name"
              value={<span className="person-name-value">{name}</span>}
            />
            <StatusValuesProperty
              label="Classification"
              values={getStatusValues(status, ['classified_as'])}
            />
            {findTimespan(status) && (
              <ObjectCardProperty
                label="Date"
                value={<TimespanValue timespan={findTimespan(status)} />}
              />
            )}
            <SourcesProperty node={status} />
          </ObjectCardPropertyList>
        ))}
      </div>
    </ObjectCardSection>
  );
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
      timespan: findTimespan(event),
    }))
    .filter(({ locations, timespan }) => locations.length || timespan);
  if (!events.length) {
    return null;
  }

  return (
    <ObjectCardSection title={title}>
      <div className="person-status-list">
        {events.map(({ event, locations, timespan }, index) => (
          <ObjectCardPropertyList key={index} className="person-status">
            {timespan && (
              <ObjectCardProperty
                label="Date"
                value={<TimespanValue timespan={timespan} />}
              />
            )}
            <StatusValuesProperty
              label={getEventLocationLabel(locations)}
              values={locations}
            />
            <SourcesProperty node={event} />
          </ObjectCardPropertyList>
        ))}
      </div>
    </ObjectCardSection>
  );
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
};

function PersonStatusGroup({ entity, group }: PersonStatusGroupProps) {
  const statuses = getStatusNodes(entity, group)
    .filter((status) => hasStatusValues(status, group));
  const isOccupationGroup = group.type === 'SocialStatus';
  if (!statuses.length) {
    return null;
  }

  return (
    <ObjectCardSection title={group.title}>
      <div className="person-status-list">
        {statuses.map((status, index) => {
          const timespan = findTimespan(status);
          return (
            <ObjectCardPropertyList
              key={index}
              className={`person-status${isOccupationGroup ? ' person-occupation-status' : ''}`}
            >
              {isOccupationGroup && timespan && (
                <ObjectCardProperty
                  className="person-status-date"
                  label="Date"
                  value={<TimespanValue timespan={timespan} />}
                />
              )}
              {group.properties.map((property, propertyIndex) => (
                <StatusValuesProperty
                  key={property.label}
                  className={isOccupationGroup && propertyIndex === 0
                    ? 'person-status-primary'
                    : undefined}
                  label={property.label}
                  values={getStatusValues(status, property.keys)}
                />
              ))}
              {getAdditionalStatusProperties(status, group).map((property) => (
                <StatusValuesProperty
                  key={property.key}
                  label={property.label}
                  values={property.values}
                />
              ))}
              <StatusValuesProperty
                label="Geographic scope"
                values={getStatusValues(status, ['has_geographic_scope'])}
              />
              <StatusValuesProperty
                label="Classification"
                values={getStatusValues(status, ['classified_as'])}
              />
              {!isOccupationGroup && timespan && (
                <ObjectCardProperty
                  label="Date"
                  value={<TimespanValue timespan={timespan} />}
                />
              )}
              <SourcesProperty
                className={isOccupationGroup
                  ? 'person-status-sources'
                  : undefined}
                node={status}
              />
            </ObjectCardPropertyList>
          );
        })}
      </div>
    </ObjectCardSection>
  );
}

function hasStatusValues(status: LinkedArtNode, group: StatusGroup): boolean {
  return group.properties.some((property) =>
    getStatusValues(status, property.keys).length > 0,
  ) || getAdditionalStatusProperties(status, group).length > 0
    || getStatusValues(status, ['has_geographic_scope']).length > 0
    || getStatusValues(status, ['classified_as']).length > 0
    || !!findTimespan(status);
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
  values: StatusValue[];
};

function StatusValuesProperty({
  className,
  label: propertyLabel,
  values,
}: StatusValuesPropertyProps) {
  if (!values.length) {
    return null;
  }
  return (
    <ObjectCardProperty
      className={className}
      label={propertyLabel}
      value={<StatusValues values={values} />}
    />
  );
}

function StatusValues({ values }: Pick<StatusValuesPropertyProps, 'values'>) {
  return (
    <span className="person-status-values">
      {values.map((value, index) => (
        <span key={index}>
          {index > 0 && ', '}
          {isLinkedArtNode(value) ? <RelationLink node={value} /> : value}
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
  const sources = findByPath(node, ['referred_to_by'])
    .filter(isVisibleSource);
  if (!sources.length) {
    return null;
  }
  return (
    <ObjectCardProperty
      className={className}
      label="Sources"
      value={<SourceList sources={sources} />}
    />
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
