import {
  ObjectCardBody,
  ObjectCardPanel,
  ObjectCardProperty,
  ObjectCardPropertyList,
  ObjectCardSection,
} from '@globalise/design';
import {
  asArray,
  findByPath,
  findTimespan,
  getContent,
  getValue,
  getValues,
  isLinkedArtNode,
  label,
  LinkedArtNode,
} from '@globalise/common';
import { relationKeys } from './LabeledKey.ts';
import { NodeList } from './NodeList.tsx';
import { RelationLink } from './RelationLink.tsx';
import { SourceList } from './SourceList.tsx';
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
      { label: 'Relation', keys: ['ascribes_classification_relation'] },
    ],
  },
  {
    title: 'Statuses and occupations',
    column: 'right',
    key: 'is_social_status_subject_of',
    type: 'SocialStatus',
    properties: [
      { label: 'Status or occupation', keys: ['ascribes_social_status'] },
      { label: 'Relation', keys: ['ascribes_social_status_relation'] },
      {
        label: 'In relation to',
        keys: ['ascribes_social_status_in_relation_to'],
      },
    ],
  },
  {
    title: 'Locations',
    column: 'right',
    key: 'is_residence_subject_of',
    type: 'ResidentialStatus',
    properties: [
      { label: 'Place', keys: ['ascribes_residence_place'] },
      { label: 'Relation', keys: ['ascribes_residence_relation'] },
    ],
  },
  {
    title: 'Relations',
    column: 'right',
    key: 'is_familial_subject_of',
    type: 'FamilyStatus',
    properties: [
      { label: 'Person', keys: ['ascribes_relative'] },
      { label: 'Relation', keys: ['ascribes_familial_relation'] },
    ],
  },
  {
    title: 'Social relations',
    column: 'right',
    key: 'is_social_relation_subject_of',
    type: 'SocialRelationStatus',
    properties: [
      { label: 'Group', keys: ['ascribes_social_relation_target'] },
      { label: 'Relation', keys: ['ascribes_social_relation'] },
    ],
  },
  {
    title: 'Similarity',
    column: 'right',
    key: 'is_similarity_subject_of',
    type: 'SimilarityStatus',
    properties: [
      { label: 'Entity', keys: ['ascribes_similarity_target'] },
      { label: 'Relation', keys: ['ascribes_similarity_relation'] },
      { label: 'Mode', keys: ['ascribes_similarity_mode'] },
    ],
  },
  {
    title: 'Memberships',
    column: 'right',
    key: 'is_membership_subject_of',
    type: 'MembershipStatus',
    properties: [
      { label: 'Group', keys: ['ascribes_group'] },
      { label: 'Relation', keys: ['ascribes_membership_relation'] },
    ],
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
  const sources = findByPath(entity, ['referred_to_by']);

  return (
    <ObjectCardBody>
      <ObjectCardPanel side="left">
        <PersonNameDetailsSection entity={entity}/>
        {personStatusGroups
          .filter((group) => group.column === 'left')
          .map((group) => (
            <PersonStatusGroup key={group.title} entity={entity} group={group}/>
          ))}
        <PersonEventSection entity={entity} property="born" title="Born"/>
        <PersonEventSection entity={entity} property="died" title="Died"/>
        {!!sources.length && (
          <ObjectCardSection title="Sources">
            <SourceList sources={sources}/>
          </ObjectCardSection>
        )}
      </ObjectCardPanel>
      <ObjectCardPanel side="right">
        {personStatusGroups
          .filter((group) => group.column === 'right')
          .map((group) => (
            <PersonStatusGroup key={group.title} entity={entity} group={group}/>
          ))}
        {relationKeys.map((relation) => (
          <NodeList
            key={relation.key}
            title={relation.label}
            nodes={findByPath(entity, [relation.key])}
          />
        ))}
      </ObjectCardPanel>
    </ObjectCardBody>
  );
}

export function getPersonTitle(entity: LinkedArtNode): string {
  const [name] = getPersonNameRecords(entity).map((record) => record.name);
  return [name, getContent(entity), entity.id, entity.type]
    .find((value) => !!value) ?? '';
}

export function PersonNameSummary({ entity }: PersonCardBodyProps) {
  const names = [...new Set(
    getPersonNameRecords(entity).map((record) => record.name),
  )];
  const alternativeNames = names.slice(1);
  if (!alternativeNames.length) {
    return null;
  }
  return (
    <div className="person-names">
      <span className="person-names-title">also recorded as:</span>
      {alternativeNames.map((name) => (
        <span key={name} className="person-name">{name}</span>
      ))}
    </div>
  );
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
            <StatusValuesProperty
              label="Relation"
              values={getStatusValues(status, [
                'ascribes_appellative_relation',
              ])}
            />
            <StatusValuesProperty
              label="Identifier"
              values={getStatusValues(status, [
                'identified_by',
                'is_identified_by',
              ])}
            />
            {findTimespan(status) && (
              <ObjectCardProperty
                label="Date"
                value={<TimespanValue timespan={findTimespan(status)}/>}
              />
            )}
            <SourcesProperty node={status}/>
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

function PersonEventSection({ entity, property, title }: PersonEventSectionProps) {
  const events = findByPath(entity, [property]);
  if (!events.length) {
    return null;
  }

  return (
    <ObjectCardSection title={title}>
      <div className="person-status-list">
        {events.map((event, index) => (
          <ObjectCardPropertyList key={index} className="person-status">
            <StatusValuesProperty
              label="Type"
              values={getStatusValues(event, ['classified_as'])}
            />
            {findTimespan(event) && (
              <ObjectCardProperty
                label="Date"
                value={<TimespanValue timespan={findTimespan(event)}/>}
              />
            )}
            <StatusValuesProperty
              label="Place"
              values={getStatusValues(event, ['took_place_at'])}
            />
            <SourcesProperty node={event}/>
          </ObjectCardPropertyList>
        ))}
      </div>
    </ObjectCardSection>
  );
}

type PersonStatusGroupProps = {
  entity: LinkedArtNode;
  group: StatusGroup;
};

function PersonStatusGroup({ entity, group }: PersonStatusGroupProps) {
  const statuses = getStatusNodes(entity, group);
  if (!statuses.length) {
    return null;
  }

  return (
    <ObjectCardSection title={group.title}>
      <div className="person-status-list">
        {statuses.map((status, index) => (
          <ObjectCardPropertyList key={index} className="person-status">
            {group.properties.map((property) => (
              <StatusValuesProperty
                key={property.label}
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
            <StatusValuesProperty
              label="Identifier"
              values={getStatusValues(status, [
                'identified_by',
                'is_identified_by',
              ])}
            />
            {findTimespan(status) && (
              <ObjectCardProperty
                label="Date"
                value={<TimespanValue timespan={findTimespan(status)}/>}
              />
            )}
            <SourcesProperty node={status}/>
          </ObjectCardPropertyList>
        ))}
      </div>
    </ObjectCardSection>
  );
}

function getStatusNodes(
  entity: LinkedArtNode,
  definition: Pick<StatusDefinition, 'key' | 'type'>,
): LinkedArtNode[] {
  return findByPath(entity, [definition.key])
    .filter((status) => status.type === definition.type);
}

type StatusValuesPropertyProps = {
  label: string;
  values: StatusValue[];
};

function StatusValuesProperty({ label: propertyLabel, values }: StatusValuesPropertyProps) {
  if (!values.length) {
    return null;
  }
  return (
    <ObjectCardProperty
      label={propertyLabel}
      value={<StatusValues values={values}/>}
    />
  );
}

function StatusValues({ values }: Pick<StatusValuesPropertyProps, 'values'>) {
  return (
    <span className="person-status-values">
      {values.map((value, index) => (
        <span key={index}>
          {index > 0 && ', '}
          {isLinkedArtNode(value) ? <RelationLink node={value}/> : value}
        </span>
      ))}
    </span>
  );
}

function SourcesProperty({ node }: { node: LinkedArtNode }) {
  const sources = findByPath(node, ['referred_to_by']);
  if (!sources.length) {
    return null;
  }
  return (
    <ObjectCardProperty
      label="Sources"
      value={<SourceList sources={sources}/>}
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
    .filter((key) => key.includes('ascribes_') && !configuredKeys.has(key))
    .map((key) => ({
      key,
      label: getPropertyLabel(key),
      values: getStatusValues(status, [key]),
    }))
    .filter((property) => property.values.length);
}

function getPropertyLabel(key: string): string {
  const prefix = 'ascribes_';
  const words = key.slice(key.indexOf(prefix) + prefix.length).replaceAll('_', ' ');
  return `${words.charAt(0).toUpperCase()}${words.slice(1)}`;
}

function getStatusValueText(value: StatusValue): string {
  return typeof value === 'string'
    ? value
    : getContent(value)
      || getValue(value.value)
      || (value.type === 'Type' ? label(value) : '');
}

function getPersonNameRecords(entity: LinkedArtNode) {
  return getStatusNodes(entity, personNameDefinition)
    .flatMap((status, statusIndex) => getStatusValues(status, [
      'ascribes_appellation',
      'aaao:ZP6_ascribes_appellation',
    ]).map((value, valueIndex) => ({
      key: `${status.id ?? statusIndex}-${valueIndex}`,
      name: getStatusValueText(value),
      status,
    })))
    .filter((record) => !!record.name);
}
