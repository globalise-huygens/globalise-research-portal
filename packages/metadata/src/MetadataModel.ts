import { RegistryComponentName } from './registry';

export type MetadataEntry = {
  label: string;
  value: string;
  url?: string;
  children: MetadataEntry[];

  /**
   * Allows matching metadata to a component based on {@link MatchRule}s
   * Includes the property name and classified_as property
   */
  tags: string[];

  /**
   * Original linked art element:
   */
  source: unknown;
};

export type CategoryName = string;

export type MatchTarget = {
  category: CategoryName;
  component: RegistryComponentName;
  label?: string;
};

export const defaultTarget = {
  category: 'other',
  component: 'default',
  label: undefined,
} satisfies MatchTarget;

export type MatchRule = {
  /**
   * Must match to the tags a {@link MetadataEntry}
   */
  tags: string[];
  target: MatchTarget
};

export type MetadataCategory = {
  name: CategoryName;
  label: string
};

export type MetadataConfig = {
  propsToSkip: string[];
  categories: MetadataCategory[];
  defaultCategory: CategoryName
  rules: MatchRule[];
  /**
   * If 'append' the metadata entry will be added to {@link defaultCategory}
   */
  onNoMatch?: 'append' | 'hide';
};

export type ComponentName = string;

/**
 * Metadata entry matched to a component from {@link componentRegistry}
 */
export type MetadataWithComponent = {
  metadata: MetadataEntry;
  component: RegistryComponentName;
  children: MetadataWithComponent[];
};

/**
 * Metadata categories with their entries
 */
export type CategoryView = {
  category: string;
  metadata: MetadataWithComponent[]
};