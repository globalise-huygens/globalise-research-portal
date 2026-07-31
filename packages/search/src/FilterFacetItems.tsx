import { CSSProperties, useMemo } from 'react';
import { Checkbox, IconExpandSection } from '@globalise/design';
import { Hierarchy, useHierarchy, useFilterFacetContext } from '@knaw-huc/faceted-search-react';
import { Tree, TreeItem, TreeItemContent, Button } from 'react-aria-components';
import classes from './FilterFacetItems.module.css';

export type FilterFacetItem = {
  itemKey: string;
  label: string;
  amount: number;
  children?: FilterFacetItem[];
};

export default function FilterFacetItems({ items }: {  items: FilterFacetItem[] }) {
  const { selected, onSelect } = useFilterFacetContext();

  const hasChildren = items.some((item) => item.children && item.children.length > 0);

  const expandedKeys = useMemo(() => {
    const addExpandingKeys = (item: FilterFacetItem) => {
      if (item.children) {
        keys.add(item.itemKey);
        item.children.map(addExpandingKeys);
      }
    };

    const keys = new Set<string>();
    items.map(addExpandingKeys);

    return keys;
  }, [items]);

  return (
    <Hierarchy items={items} selected={selected} setSelected={onSelect}
      getKey={(item) => item.itemKey} getChildren={(item) => item.children}>
      <Tree selectionMode="multiple" aria-label="Facet items" defaultExpandedKeys={expandedKeys}>
        <TreeItems items={items} facetHasChildren={hasChildren}/>
      </Tree>
    </Hierarchy>
  );
}

function TreeItems({ items, facetHasChildren }: {
  items: FilterFacetItem[],
  facetHasChildren: boolean,
}) {
  return (
    <>
      {items.map((item) => (
        <TreeItem key={item.itemKey} id={item.itemKey} textValue={item.label}
          hasChildItems={item.children && item.children.length > 0}>
          <TreeItemContent>
            {({ hasChildItems, isExpanded, level }) =>
              <FilterFacetTreeItemContent item={item} level={level} facetHasChildren={facetHasChildren}
                hasChildren={hasChildItems} isOpen={isExpanded}/>}
          </TreeItemContent>

          {item.children && item.children.length > 0 &&
              <TreeItems items={item.children} facetHasChildren={facetHasChildren}/>}
        </TreeItem>
      ))}
    </>
  );
}

function FilterFacetTreeItemContent({ item, level, facetHasChildren, hasChildren, isOpen }: {
  item: FilterFacetItem,
  level: number,
  facetHasChildren: boolean,
  hasChildren: boolean,
  isOpen: boolean,
}) {
  const { toggle, isSelected, isPartial } = useHierarchy();

  const selected = useMemo(() => isSelected(item.itemKey), [item, isSelected]);
  const indeterminate = useMemo(() => isPartial(item.itemKey), [item, isPartial]);

  return (
    <div className={classes.item}
      style={{ '--indent': level > 1 ? `${(level - 1) * 0.5}rem` : 0 } as CSSProperties}>
      {hasChildren && <Button slot="chevron" className={`${classes.toggle} ${isOpen ? classes.expanded : ''}`}>
        <IconExpandSection/>
      </Button>}

      <Checkbox slot="selection" className={classes.checkbox} name={item.itemKey}
        indicatorClassName={`${classes.indicator} ${facetHasChildren && !hasChildren ? classes.leaf : ''}`}
        isSelected={selected} isIndeterminate={indeterminate}
        onChange={() => toggle(item.itemKey)}>
        <ItemContent item={item}/>
      </Checkbox>
    </div>
  );
}

function ItemContent({ item }: { item: FilterFacetItem }) {
  return (
    <span className={classes.inner}>
      <span>{item.label}</span>
      <span aria-label="Amount of results">
        {item.amount.toLocaleString()}
      </span>
    </span>
  );
}
