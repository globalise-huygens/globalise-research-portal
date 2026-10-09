import {
  cidocEntityClassificationIds,
  getCidocClassNameByClassificationId,
  getEntityClassificationDefinition,
  isCidocEntityClassificationId,
  type CidocEntityClassificationId,
} from '@globalise/common/annotation';
import {
  setEntityHighlightCategories,
  useEntityHighlightCategories,
} from '@globalise/common/document';
import {
  EntityIcon,
  IconEntities,
} from '@globalise/design';
import {
  EntityHighlightMenu,
  type EntityHighlightCategory,
} from './EntityHighlightMenu';
import * as React from 'react';
import { TOP_BAR_BUTTON } from './buttonClasses';

const iconClassName = 'toolbar-icon';

type EntityHighlightCategoryConfig = {
  id: string;
  label: string;
  icon: React.ReactNode;
  subcategories?: {
    id: CidocEntityClassificationId;
    label: string;
  }[];
};

const entityCategoryConfigs = createEntityCategoryConfigs();

function createEntityCategoryConfigs(): EntityHighlightCategoryConfig[] {
  const categories = new Map<string, EntityHighlightCategoryConfig>();

  for (const id of cidocEntityClassificationIds) {
    const definition = getEntityClassificationDefinition(id);
    const group = definition.highlightGroup;
    if (!group) {
      categories.set(id, {
        id,
        label: definition.highlightLabel,
        icon: (
          <EntityIcon
            type={definition.presentationType}
            className={iconClassName}
          />
        ),
      });
      continue;
    }

    const category: EntityHighlightCategoryConfig = categories.get(group.id) ?? {
      id: group.id,
      label: group.label,
      icon: (
        <EntityIcon
          type={definition.presentationType}
          className={iconClassName}
        />
      ),
      subcategories: [],
    };
    category.subcategories?.push({ id, label: definition.highlightLabel });
    categories.set(group.id, category);
  }

  return Array.from(categories.values());
}

const entityCategories: EntityHighlightCategory[] =
  entityCategoryConfigs.map((category) => {
    const subcategories = category.subcategories?.map((subcategory) => ({
      ...subcategory,
      tone: getCidocClassNameByClassificationId(subcategory.id),
    }));

    return {
      ...category,
      tone: isCidocEntityClassificationId(category.id)
        ? getCidocClassNameByClassificationId(category.id)
        : subcategories?.[0]?.tone,
      subcategories,
    };
  });

export function ManifestEntityHighlightMenu() {
  const selectedCategories = useEntityHighlightCategories();
  const selectedKeys = React.useMemo(
    () => new Set<string>(selectedCategories),
    [selectedCategories],
  );

  const handleSelectedKeysChange = React.useCallback(
    (update: React.SetStateAction<Set<string>>) => {
      const current = new Set<string>(selectedCategories);
      const updated = typeof update === 'function' ? update(current) : update;
      const next = new Set<CidocEntityClassificationId>();

      for (const key of updated) {
        if (isCidocEntityClassificationId(key)) {
          next.add(key);
        }
      }

      setEntityHighlightCategories(next);
    },
    [selectedCategories],
  );

  return (
    <EntityHighlightMenu
      categories={entityCategories}
      selectedKeys={selectedKeys}
      onSelectedKeysChange={handleSelectedKeysChange}
      triggerIcon={<IconEntities className={iconClassName} />}
      triggerClassName={TOP_BAR_BUTTON}
      triggerLabel="Entity highlights"
      allLabel="Show all"
    />
  );
}
