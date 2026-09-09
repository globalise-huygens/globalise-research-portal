import { CSSProperties, Suspense, useMemo } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Checkbox, IconExpandSection } from '@globalise/design';
import {
  Hierarchy,
  useHierarchy,
  useFilterFacet,
  useFilterFacetSelection,
  useSearchState,
} from '@knaw-huc/faceted-search-react';
import { Tree, TreeItem, TreeItemContent, Button } from 'react-aria-components';
import hierarchyFacetItemsQueryOptions from './queries/hierarchyFacetItemsQueryOptions';
import Facet from './Facet';
import classes from './FilterFacet.module.css';

import type { HierarchyFacetItem } from './elasticsearch/hierarchyFacetItems.server';

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
  const { query, facetValues } = useSearchState();
  const { selected, onSelect } = useFilterFacetSelection(facetKey);
  const { data: items } = useSuspenseQuery(hierarchyFacetItemsQueryOptions({
    key: facetKey,
    query,
    facets: facetValues,
  }));

  const expandedKeys = useMemo(() => {
    const addExpandingKeys = (item: HierarchyFacetItem) => {
      if (item.children) {
        keys.add(item.id);
        item.children.map(addExpandingKeys);
      }
    };

    const keys = new Set<string>();
    items.map(addExpandingKeys);

    return keys;
  }, [items]);

  return (
    <Hierarchy items={items} selected={selected} setSelected={onSelect}
      getKey={(item) => item.id} getChildren={(item) => item.children}>
      <Tree selectionMode="multiple" aria-label="Facet items" defaultExpandedKeys={expandedKeys}>
        <TreeItems items={items}/>
      </Tree>
    </Hierarchy>
  );
}

function TreeItems({ items }: { items: HierarchyFacetItem[] }) {
  return (
    <>
      {items.map((item) => (
        <TreeItem key={item.id} id={item.id} textValue={item.label}
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
  item: HierarchyFacetItem,
  level: number,
  hasChildren: boolean,
  isOpen: boolean,
}) {
  const { toggle, isSelected, isPartial } = useHierarchy();

  const selected = useMemo(() => isSelected(item.id), [item, isSelected]);
  const indeterminate = useMemo(() => isPartial(item.id), [item, isPartial]);

  return (
    <div className={classes.item}
      style={{ '--indent': level > 1 ? `${(level - 1) * 0.5}rem` : 0 } as CSSProperties}>
      <Checkbox slot="selection" className={classes.checkbox} name={item.id}
        indicatorClassName={classes.indicator}
        isSelected={selected} isIndeterminate={indeterminate}
        onChange={() => toggle(item.id)}>
        <ItemContent item={item}/>
      </Checkbox>

      {hasChildren && <Button slot="chevron" className={`${classes.toggle} ${isOpen ? classes.expanded : ''}`}>
        <IconExpandSection/>
      </Button>}
    </div>
  );
}

function ItemContent({ item }: { item: HierarchyFacetItem }) {
  return (
    <span className={classes.inner}>
      <span>{item.label}</span>
      <span aria-label="Amount of results">
        {item.count?.toLocaleString()}
      </span>
    </span>
  );
}
