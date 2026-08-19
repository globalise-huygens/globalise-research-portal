import { CSSProperties, Suspense, useMemo } from 'react';
import { Checkbox, IconExpandSection } from '@globalise/design';
import { useTextFacetItems } from '@knaw-huc/panoptes-react';
import { Hierarchy, useHierarchy, useFilterFacet, useFilterFacetSelection } from '@knaw-huc/faceted-search-react';
import { Tree, TreeItem, TreeItemContent, Button } from 'react-aria-components';
import Facet from './Facet';
import classes from './FilterFacet.module.css';

export type FilterFacetItem = {
  itemKey: string;
  label: string;
  amount: number;
  children?: FilterFacetItem[];
};

export default function FilterFacet({ facetKey }: { facetKey: string }) {
  const { label } = useFilterFacet(facetKey);

  return (
    <Facet label={label}>
      <Suspense fallback={'Loading...'}>
        <FilterFacetItems facetKey={facetKey}/>
      </Suspense>
    </Facet>
  );
}

function FilterFacetItems({ facetKey }: { facetKey: string }) {
  const { selected, onSelect } = useFilterFacetSelection(facetKey);
  const items = useTextFacetItems({ facetKey, sort: 'hits', textFilter: '', selected });

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
        <TreeItems items={items}/>
      </Tree>
    </Hierarchy>
  );
}

function TreeItems({ items }: { items: FilterFacetItem[] }) {
  return (
    <>
      {items.map((item) => (
        <TreeItem key={item.itemKey} id={item.itemKey} textValue={item.label}
          hasChildItems={item.children && item.children.length > 0}>
          <TreeItemContent>
            {({ hasChildItems, isExpanded, level }) =>
              <FilterFacetTreeItemContent item={item} level={level}
                hasChildren={hasChildItems} isOpen={isExpanded}/>}
          </TreeItemContent>

          {item.children && item.children.length > 0 &&
              <TreeItems items={item.children}/>}
        </TreeItem>
      ))}
    </>
  );
}

function FilterFacetTreeItemContent({ item, level, hasChildren, isOpen }: {
  item: FilterFacetItem,
  level: number,
  hasChildren: boolean,
  isOpen: boolean,
}) {
  const { toggle, isSelected, isPartial } = useHierarchy();

  const selected = useMemo(() => isSelected(item.itemKey), [item, isSelected]);
  const indeterminate = useMemo(() => isPartial(item.itemKey), [item, isPartial]);

  return (
    <div className={classes.item}
      style={{ '--indent': level > 1 ? `${(level - 1) * 0.5}rem` : 0 } as CSSProperties}>
      <Checkbox slot="selection" className={classes.checkbox} name={item.itemKey}
        indicatorClassName={classes.indicator}
        isSelected={selected} isIndeterminate={indeterminate}
        onChange={() => toggle(item.itemKey)}>
        <ItemContent item={item}/>
      </Checkbox>

      {hasChildren && <Button slot="chevron" className={`${classes.toggle} ${isOpen ? classes.expanded : ''}`}>
        <IconExpandSection/>
      </Button>}
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
