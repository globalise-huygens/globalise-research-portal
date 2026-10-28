import { getStatusValues, isLinkedArtNode, type LinkedArtNode, type StatusValue } from '@globalise/common';

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

/** Friendly person-card section titles; record values come from annotations. */
export type StatusGroup = LabeledKey & { type: string };

export const personStatusGroups: StatusGroup[] = [
  { key: 'is_classificatory_subject_of', type: 'ClassificatoryStatus', label: 'Classifications' },
  { key: 'is_social_status_subject_of', type: 'SocialStatus', label: 'Occupations and statuses' },
  { key: 'is_residence_subject_of', type: 'ResidentialStatus', label: 'Places' },
  { key: 'is_familial_subject_of', type: 'FamilyStatus', label: 'Family relationships' },
  { key: 'is_social_relation_subject_of', type: 'SocialRelationStatus', label: 'Social relations' },
  { key: 'is_similarity_subject_of', type: 'SimilarityStatus', label: 'Similarity' },
  { key: 'is_membership_subject_of', type: 'MembershipStatus', label: 'Memberships' },
  { key: 'is_successor_status_subject_of', type: 'SuccessorStatus', label: 'Succession' },
  { key: 'is_ownership_subject_of', type: 'OwnershipStatus', label: 'Ownership' },
  { key: 'is_custodial_subject_of', type: 'CustodialStatus', label: 'Custody' },
];

export type StatusProperty = {
  label: string;
  keys: string[];
  linked?: boolean;
  stacked?: boolean;
};

// Only presentation overrides live here. The annotation determines which fields exist.
const statusPropertyLabels: Record<string, Omit<StatusProperty, 'keys'>> = {
  ascribes_classification: { label: 'Classification' },
  ascribes_social_status: { label: 'Status or occupation' },
  ascribes_social_status_in_relation_to: { label: 'In relation to' },
  ascribes_residence_relation: { label: 'Connection' },
  ascribes_residence_place: { label: 'Place' },
  ascribes_familial_relation: { label: 'Relationship', linked: false },
  ascribes_relative: { label: 'Person', stacked: true },
  ascribes_social_relation: { label: 'Relationship' },
  ascribes_social_relation_target: { label: 'Group' },
  ascribes_similarity_target: { label: 'Entity' },
  ascribes_similarity_mode: { label: 'Mode' },
  ascribes_membership_relation: { label: 'Membership type' },
  ascribes_group: { label: 'Group' },
  ascribes_succession_relation: { label: 'Succession type' },
  ascribes_succeeded_sovereignty: { label: 'Sovereignty' },
};

/** Read ascribed fields, including unfamiliar ones, without a per-status field schema. */
export function getStatusProperties(status: LinkedArtNode): (StatusProperty & { values: StatusValue[] })[] {
  return Object.keys(status).filter((key) => key.includes('ascribes_')).flatMap((key) => {
    const name = key.slice(key.indexOf('ascribes_'));
    const presentation = statusPropertyLabels[name];
    const values = getStatusValues(status, [key]);
    // Predicate descriptors explain the data model, rather than adding another status value.
    const predicate = name.endsWith('_relation') && !presentation && values.every((value) =>
      isLinkedArtNode(value) && /^(crm:|rdf:|rdfs:|https?:\/\/www\.cidoc-crm\.org\/)/.test(value.id ?? ''),
    );
    return values.length && !predicate
      ? [{ ...presentation, keys: [key], label: presentation?.label ?? getPropertyLabel(key), values }]
      : [];
  });
}

export function getPropertyLabel(key: string): string {
  const prefix = 'ascribes_';
  const words = key.slice(key.indexOf(prefix) + prefix.length).replaceAll('_', ' ');
  return `${words.charAt(0).toUpperCase()}${words.slice(1)}`;
}
