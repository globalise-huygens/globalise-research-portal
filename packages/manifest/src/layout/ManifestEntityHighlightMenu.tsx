import {
  entityClassificationGroups,
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

const entityCategories: EntityHighlightCategory[] =
  entityClassificationGroups.map((group) => ({
    id: group.id,
    label: group.label,
    icon: <EntityIcon type={group.tagType} className={iconClassName} />,
    tone: getCidocClassNameByClassificationId(group.classificationIds[0]),
    subcategories: isCidocEntityClassificationId(group.id)
      ? undefined
      : group.classificationIds.map((id) => ({
        id,
        label: getEntityClassificationDefinition(id).highlightLabel,
        tone: getCidocClassNameByClassificationId(id),
      })),
  }));

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
