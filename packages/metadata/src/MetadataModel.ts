export type MetadataEntry = {
  label: string;
  value: string;
  url?: string;
  children: MetadataEntry[];

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

export type MatchRule = {
  /**
   * Must match to source propName or classifiedAs of a {@link MetadataEntry}
   */
  sourceMatcher: string | string[];
  target: {
    category: CategoryName;
    component: ComponentName;
    label?: string;
  }
};

export type MetadataCategory = {
  name: CategoryName;
  label: string
};

export type MetadataConfig = {
  categories: MetadataCategory[];
  rules: MatchRule[];
  onNoMatch?: 'append' | 'hide';
};

export type ComponentName = string;

/**
 * Metadata entry matched to a component from {@link componentRegistry}
 */
export type ComponentEntry = {
  entry: MetadataEntry
  componentName: ComponentName;
};

/**
 * Metadata categories with their entries
 */
export type CategoryView = {
  categoryName: string;
  items: ComponentEntry[]
};