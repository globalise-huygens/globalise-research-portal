import {
  cidocEntityClassificationIds,
  getEntityPresentationFamilyByClassificationId,
  getEntityClassificationDefinition,
  getEntityClassificationUri,
  isCidocEntityClassificationId,
  type CidocEntityClassificationId,
  type ClassifiedCategory,
} from '@globalise/common/annotation';
import {
  setHighlightCategories,
  useHighlightCategories,
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
import { getEntityCategoryConceptUri } from './entityCategoryConcepts';

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
      family: getEntityPresentationFamilyByClassificationId(subcategory.id),
      preview: {
        uri: getEntityClassificationUri(subcategory.id),
        conceptUri: getEntityCategoryConceptUri(subcategory.id),
        isAppellativeSubject: subcategory.id === 'ner:loc_adj',
      },
    }));
    const firstClassificationId = category.subcategories?.[0]?.id;
    const classificationId = isCidocEntityClassificationId(category.id)
      ? category.id
      : undefined;

    return {
      ...category,
      family: classificationId
        ? getEntityPresentationFamilyByClassificationId(classificationId)
        : subcategories?.[0]?.family,
      subcategories,
      preview: classificationId
        ? {
          uri: getEntityClassificationUri(classificationId),
          conceptUri: getEntityCategoryConceptUri(classificationId),
        }
        : firstClassificationId
          ? {
            uri: getEntityCategoryConceptUri(firstClassificationId),
            classificationIds: category.subcategories?.map((subcategory) => subcategory.id),
          }
          : undefined,
    };
  });

export function ManifestEntityHighlightMenu() {
  const selectedCategories = useHighlightCategories();
  const selectedKeys = React.useMemo(
    () => new Set<string>(
      [...selectedCategories].filter(isCidocEntityClassificationId),
    ),
    [selectedCategories],
  );

  const handleSelectedKeysChange = React.useCallback(
    (update: React.SetStateAction<Set<string>>) => {
      const updated = typeof update === 'function'
        ? update(new Set(selectedKeys))
        : update;
      const next = new Set<ClassifiedCategory>(
        [...selectedCategories].filter((category) => !isCidocEntityClassificationId(category)),
      );

      for (const key of updated) {
        if (isCidocEntityClassificationId(key)) {
          next.add(key);
        }
      }

      setHighlightCategories(next);
    },
    [selectedCategories, selectedKeys],
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
