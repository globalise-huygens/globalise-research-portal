import { CSSProperties, Suspense, useEffect, useMemo, useState } from 'react';
import { useIsFetching, useSuspenseQuery } from '@tanstack/react-query';
import { Checkbox, IconExpandSection } from '@globalise/design';
import {
  Hierarchy,
  useHierarchy,
  useFilterFacet,
  useFilterFacetSelection,
  useUpdateFacetValueLabels,
  useSearchState,
} from '@knaw-huc/faceted-search-react';
import { Tree, TreeItem, TreeItemContent, Button, Virtualizer, ListLayout, type Key } from 'react-aria-components';
import hierarchyFacetItemsQueryOptions, { hierarchyFacetItemsQueryKey } from './queries/hierarchyFacetItemsQueryOptions';
import getSearchState from './utils/getSearchState';
import Facet from './Facet';
import classes from './HierarchyFacet.module.css';

import type { HierarchyFacetItem } from './elasticsearch/hierarchyFacetItems.server';

function mapLabels(results: HierarchyFacetItem[]) {
  return results.reduce<Record<string, string>>((acc, result) => {
    if (result.label) {
      acc[result.id] = result.label;
    }
    if (result.children) {
      Object.assign(acc, mapLabels(result.children));
    }
    return acc;
  }, {});
}

export default function HierarchyFacet({ facetKey }: { facetKey: string }) {
  const { label } = useFilterFacet(facetKey);
  const isFetching = useIsFetching({ queryKey: hierarchyFacetItemsQueryKey(facetKey) }) > 0;

  return (
    <Facet label={label} isPending={isFetching}>
      <Suspense>
        <HierarchyFacetItems facetKey={facetKey}/>
      </Suspense>
    </Facet>
  );
}

function HierarchyFacetItems({ facetKey }: { facetKey: string }) {
  const state = useSearchState();
  const { selected, onSelect } = useFilterFacetSelection(facetKey);
  const updateFacetValueLabels = useUpdateFacetValueLabels(facetKey);
  const { data: items } = useSuspenseQuery(hierarchyFacetItemsQueryOptions(facetKey, getSearchState(state)));

  const [expandedKeys, setExpandedKeys] = useState<Set<Key>>(new Set());

  useEffect(() => updateFacetValueLabels(mapLabels(items)), [updateFacetValueLabels, items]);

  return (
    <Hierarchy items={items} selected={selected} setSelected={onSelect}
      getKey={(item) => item.id} getChildren={(item) => item.children}>
      <Virtualizer layout={ListLayout} layoutOptions={{ estimatedRowSize: 24, gap: 8 }}>
        <Tree
          selectionMode="multiple"
          aria-label="Facet items"
          className={classes.tree}
          expandedKeys={expandedKeys}
          onExpandedChange={setExpandedKeys}
        >
          <TreeItems
            items={items}
            expandedKeys={expandedKeys}
          />
        </Tree>
      </Virtualizer>
    </Hierarchy>
  );
}

function TreeItems({ items, expandedKeys }: { items: HierarchyFacetItem[], expandedKeys: Set<Key> }) {
  return (
    <>
      {items.map((item) => (
        <TreeItem key={item.id} id={item.id} textValue={item.label}
          hasChildItems={item.children && item.children.length > 0}>
          <TreeItemContent>
            {({ hasChildItems, isExpanded, level }) =>
              <HierarchyFacetTreeItemContent item={item} level={level}
                hasChildren={hasChildItems} isOpen={isExpanded}/>}
          </TreeItemContent>

          {item.children && expandedKeys.has(item.id) &&
              <TreeItems items={item.children} expandedKeys={expandedKeys}/>}
        </TreeItem>
      ))}
    </>
  );
}

function HierarchyFacetTreeItemContent({ item, level, hasChildren, isOpen }: {
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
