import {
  entityClassificationGroups,
  getEntityPresentationFamilyByClassificationId,
  getEntityClassificationDefinition,
  isCidocEntityClassificationId,
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

const iconClassName = 'toolbar-icon';

const entityCategories: EntityHighlightCategory[] =
  entityClassificationGroups.map((group) => ({
    id: group.id,
    label: group.label,
    icon: <EntityIcon type={group.tagType} className={iconClassName} />,
    family: getEntityPresentationFamilyByClassificationId(group.classificationIds[0]),
    subcategories: isCidocEntityClassificationId(group.id)
      ? undefined
      : group.classificationIds.map((id) => ({
        id,
        label: getEntityClassificationDefinition(id).highlightLabel,
        family: getEntityPresentationFamilyByClassificationId(id),
      })),
  }));

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
