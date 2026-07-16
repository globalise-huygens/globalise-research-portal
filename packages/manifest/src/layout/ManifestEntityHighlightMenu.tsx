import {
  entityVisualCategories,
  isEntityVisualCategory,
  type EntityVisualCategoryClassName,
} from '@globalise/common/annotation';
import {
  setEntityHighlightCategories,
  useEntityHighlightCategories,
} from '@globalise/common/document';
import { IconEntities } from '@globalise/design';
import {
  EntityHighlightMenu,
  type EntityHighlightCategory,
} from '@globalise/design/viewer';
import * as React from 'react';
import { TOP_BAR_BUTTON } from './buttonClasses';

const iconClassName = 'manifest-document-layout__toolbar-icon';

const entityCategoryConfig: Record<
  EntityVisualCategoryClassName,
  EntityHighlightCategory
> = {
  'cidoc-actor': {
    id: 'cidoc-actor',
    label: 'Actors',
    tone: 'cidoc-actor',
  },
  'cidoc-appellation': {
    id: 'cidoc-appellation',
    label: 'Appellations',
    tone: 'cidoc-appellation',
  },
  'cidoc-conceptual-object': {
    id: 'cidoc-conceptual-object',
    label: 'Conceptual objects',
    tone: 'cidoc-conceptual-object',
  },
  'cidoc-dimension': {
    id: 'cidoc-dimension',
    label: 'Dimensions',
    tone: 'cidoc-dimension',
  },
  'cidoc-physical-thing': {
    id: 'cidoc-physical-thing',
    label: 'Physical things',
    tone: 'cidoc-physical-thing',
  },
  'cidoc-place': {
    id: 'cidoc-place',
    label: 'Places',
    tone: 'cidoc-place',
  },
  'cidoc-time-span': {
    id: 'cidoc-time-span',
    label: 'Time spans',
    tone: 'cidoc-time-span',
  },
  'cidoc-type': {
    id: 'cidoc-type',
    label: 'Types',
    tone: 'cidoc-type',
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
    <EntityHighlightMenu
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
