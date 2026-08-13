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
