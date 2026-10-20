/**
 * A property to show as a section, and the label to show it under.
 * Entities of every kind share these properties,
 * so no kind specific configuration is needed.
 */
export type LabeledKey = {
  key: string;
  label: string;
};

/**
 * Globalise status properties, holding ascribed values
 * together with the source they were ascribed by.
 */
export const statusKeys: LabeledKey[] = [
  { key: 'is_appellative_subject_of', label: 'Names' },
  { key: 'is_social_status_subject_of', label: 'Social status' },
  { key: 'is_classificatory_subject_of', label: 'Classification' },
  { key: 'is_residence_subject_of', label: 'Residence' },
  { key: 'is_familial_subject_of', label: 'Family' },
  { key: 'is_similarity_subject_of', label: 'Similarity' },
  { key: 'is_custodial_subject_of', label: 'Custody' },
  { key: 'is_ownership_subject_of', label: 'Ownership' },
];

/**
 * Events that brought the entity into or out of existence.
 */
export const eventKeys: LabeledKey[] = [
  { key: 'born', label: 'Born' },
  { key: 'died', label: 'Died' },
  { key: 'produced_by', label: 'Produced' },
  { key: 'taken_out_of_existence_by', label: 'Destroyed' },
];

/**
 * Links towards other entities.
 */
export const relationKeys: LabeledKey[] = [
  { key: 'part_of', label: 'Part of' },
  { key: 'member_of', label: 'Member of' },
  { key: 'moved_by', label: 'Voyages' },
  { key: 'changed_ownership_through', label: 'Ownership changes' },
];

/** Person-card presentation labels and property order, shared with label helpers. */
export type StatusProperty = {
  label: string;
  keys: string[];
  linked?: boolean;
  stacked?: boolean;
};

export type StatusDefinition = {
  key: string;
  type: string;
  properties: StatusProperty[];
};

export type StatusGroup = StatusDefinition & {
  title: string;
};

export const personStatusGroups: StatusGroup[] = [
  {
    title: 'Classifications',
    key: 'is_classificatory_subject_of',
    type: 'ClassificatoryStatus',
    properties: [
      { label: 'Classification', keys: ['ascribes_classification'] },
    ],
  },
  {
    title: 'Occupations and statuses',
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
    title: 'Places',
    key: 'is_residence_subject_of',
    type: 'ResidentialStatus',
    properties: [
      {
        label: 'Connection',
        keys: ['ascribes_residence_relation'],
      },
      { label: 'Place', keys: ['ascribes_residence_place'] },
    ],
  },
  {
    title: 'Family relationships',
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


export function getPropertyLabel(key: string): string {
  const prefix = 'ascribes_';
  const words = key
    .slice(key.indexOf(prefix) + prefix.length)
    .replaceAll('_', ' ');
  return `${words.charAt(0).toUpperCase()}${words.slice(1)}`;
}
