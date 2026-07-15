import {
  entityVisualCategories,
  isEntityVisualCategory,
  type EntityVisualCategoryClassName,
} from '@globalise/common/annotation';
import {
  setEntityHighlightCategories,
  useEntityHighlightCategories,
} from '@globalise/common/document';
import {
  DocumentDetailEntityHighlightMenu,
  IconEntities,
  type DocumentDetailEntityHighlightCategory,
} from '@globalise/design';
import * as React from 'react';
import { TOP_BAR_BUTTON } from './buttonClasses';

const iconClassName = 'manifest-document-layout__toolbar-icon';

const entityCategoryConfig: Record<
  EntityVisualCategoryClassName,
  DocumentDetailEntityHighlightCategory
> = {
  'cidoc-actor': {
    id: 'cidoc-actor',
    label: 'Actors',
    rowClassName: 'gds-entity-highlight-menu__tone-cidoc-actor',
    textClassName: 'gds-entity-highlight-menu__tone-text-cidoc-actor',
  },
  'cidoc-appellation': {
    id: 'cidoc-appellation',
    label: 'Appellations',
    rowClassName: 'gds-entity-highlight-menu__tone-cidoc-appellation',
    textClassName: 'gds-entity-highlight-menu__tone-text-cidoc-appellation',
  },
  'cidoc-conceptual-object': {
    id: 'cidoc-conceptual-object',
    label: 'Conceptual objects',
    rowClassName: 'gds-entity-highlight-menu__tone-cidoc-conceptual-object',
    textClassName:
      'gds-entity-highlight-menu__tone-text-cidoc-conceptual-object',
  },
  'cidoc-dimension': {
    id: 'cidoc-dimension',
    label: 'Dimensions',
    rowClassName: 'gds-entity-highlight-menu__tone-cidoc-dimension',
    textClassName: 'gds-entity-highlight-menu__tone-text-cidoc-dimension',
  },
  'cidoc-physical-thing': {
    id: 'cidoc-physical-thing',
    label: 'Physical things',
    rowClassName: 'gds-entity-highlight-menu__tone-cidoc-physical-thing',
    textClassName:
      'gds-entity-highlight-menu__tone-text-cidoc-physical-thing',
  },
  'cidoc-place': {
    id: 'cidoc-place',
    label: 'Places',
    rowClassName: 'gds-entity-highlight-menu__tone-cidoc-place',
    textClassName: 'gds-entity-highlight-menu__tone-text-cidoc-place',
  },
  'cidoc-time-span': {
    id: 'cidoc-time-span',
    label: 'Time spans',
    rowClassName: 'gds-entity-highlight-menu__tone-cidoc-time-span',
    textClassName: 'gds-entity-highlight-menu__tone-text-cidoc-time-span',
  },
  'cidoc-type': {
    id: 'cidoc-type',
    label: 'Types',
    rowClassName: 'gds-entity-highlight-menu__tone-cidoc-type',
    textClassName: 'gds-entity-highlight-menu__tone-text-cidoc-type',
  },
};

export function ManifestEntityHighlightMenu() {
  const selectedCategories = useEntityHighlightCategories();
  const selectedKeys = React.useMemo(
    () => new Set<string>(selectedCategories),
    [selectedCategories],
  );
  const categories = React.useMemo(
    () => entityVisualCategories.map((category) => entityCategoryConfig[category]),
    [],
  );

  const handleSelectedKeysChange = React.useCallback(
    (update: React.SetStateAction<Set<string>>) => {
      const current = new Set<string>(selectedCategories);
      const updated = typeof update === 'function' ? update(current) : update;
      const next = new Set<EntityVisualCategoryClassName>();

      for (const key of updated) {
        if (isEntityVisualCategory(key)) {
          next.add(key);
        }
      }

      setEntityHighlightCategories(next);
    },
    [selectedCategories],
  );

  return (
    <DocumentDetailEntityHighlightMenu
      categories={categories}
      selectedKeys={selectedKeys}
      onSelectedKeysChange={handleSelectedKeysChange}
      triggerIcon={<IconEntities className={iconClassName} />}
      triggerClassName={TOP_BAR_BUTTON}
      triggerLabel="Entity highlights"
      title="Entity highlights"
      allLabel="Show all"
      allDescription={null}
    />
  );
}
