import {
  getCidocClassNameByClassificationId,
  isCidocEntityClassificationId,
  type CidocEntityClassificationId,
} from '@globalise/common/annotation';
import {
  setEntityHighlightCategories,
  useEntityHighlightCategories,
} from '@globalise/common/document';
import {
  IconEntities,
  IconEntityCommodity,
  IconEntityDate,
  IconEntityDimensions,
  IconEntityDocument,
  IconEntityOrganisation,
  IconEntityPerson,
  IconEntityPlace,
  IconEntityShip,
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

const entityCategoryConfigs: EntityHighlightCategoryConfig[] = [
  {
    id: 'persons',
    label: 'Persons',
    icon: <IconEntityPerson className={iconClassName} />,
    subcategories: [
      { id: 'gan:PER_NAME', label: 'by Name' },
      { id: 'gan:PER_ATTR', label: 'by Attributes' },
      { id: 'gan:PRF', label: 'by Profession' },
      { id: 'gan:STATUS', label: 'by Civic Status' },
      { id: 'gan:ETH_REL', label: 'by Ethno-Religious Appellation' },
    ],
  },
  {
    id: 'organisations',
    label: 'Organisations',
    icon: <IconEntityOrganisation className={iconClassName} />,
    subcategories: [
      { id: 'gan:ORG', label: 'by Name' },
    ],
  },
  {
    id: 'ships',
    label: 'Ships',
    icon: <IconEntityShip className={iconClassName} />,
    subcategories: [
      { id: 'gan:SHIP', label: 'by Name' },
      { id: 'gan:SHIP_TYPE', label: 'by Type' },
    ],
  },
  {
    id: 'commodities',
    label: 'Commodities',
    icon: <IconEntityCommodity className={iconClassName} />,
    subcategories: [
      { id: 'gan:CMTY_NAME', label: 'by Name' },
      { id: 'gan:CMTY_QUAL', label: 'by Qualifier' },
    ],
  },
  {
    id: 'gan:DATE',
    label: 'Dates',
    icon: <IconEntityDate className={iconClassName} />,
  },
  {
    id: 'places',
    label: 'Places',
    icon: <IconEntityPlace className={iconClassName} />,
    subcategories: [
      { id: 'gan:LOC_NAME', label: 'by Name' },
      { id: 'gan:LOC_ADJ', label: 'by Location Form' },
    ],
  },
  {
    id: 'gan:DOC',
    label: 'Documents',
    icon: <IconEntityDocument className={iconClassName} />,
  },
  {
    id: 'gan:CMTY_QUANT',
    label: 'Unit',
    icon: <IconEntityDimensions className={iconClassName} />,
  },
];

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
