import { RegistryComponentName } from './registry';

export type MetadataNode = {
  label: string;
  value: string;
  url?: string;
  children: MetadataNode[];

  /**
   * Allows matching components to the data based on {@link MatchRule}s
   */
  source: {

    /**
     * Original prop name
     */
    propName?: string;

    /**
     * URI of the node's first classified_as: Getty AAT semantic tag
     */
    classifiedAs?: string
  };
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
   * Must match to source propName or classifiedAs of a {@link MetadataNode}
   */
  sourceMatcher: string | string[];
  target: MatchTarget
};

export type MetadataCategory = {
  name: CategoryName;
  label: string
};

export const defaultCategory = {
  name: 'other' as CategoryName,
  label: 'Other',
} satisfies MetadataCategory;

export type MetadataConfig = {
  categories: MetadataCategory[];
  rules: MatchRule[];
  /**
   * If 'append' the metadata entry will be added to {@link defaultCategory}
   */
  onNoMatch?: 'append' | 'hide';
};

export type ComponentName = string;

/**
 * Metadata entry matched to a component from {@link registryComponentConfig}
 */
export type MetadataWithComponent = {
  metadata: MetadataNode;
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