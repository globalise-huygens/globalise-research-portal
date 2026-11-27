import { useEffect, useRef, type ReactNode } from 'react';
import { useQueries } from '@tanstack/react-query';
import { url, type LinkedArtNode } from '@globalise/common';
import { createObjectCardSplat } from '@globalise/common/uri';
import { useLocation } from '@globalise/router';
import { entityResourceQueryOptions } from './RelationValueResolver.ts';
import {
  buildRecordHierarchy,
  type RecordHierarchyNode,
} from './RecordHierarchyModel.ts';

type RecordHierarchyProps = {
  records: LinkedArtNode[];
  renderRecord: (record: LinkedArtNode) => ReactNode;
};

export function RecordHierarchy({
  records,
  renderRecord,
}: RecordHierarchyProps) {
  const results = useQueries({
    queries: records.map((record) =>
      entityResourceQueryOptions(url(record) ?? ''),
    ),
  });
  const list = useRef<HTMLOListElement>(null);
  const hash = useLocation({ select: (location) => location.hash });
  const pending = results.some((result) => result.isFetching);
  const hierarchy = buildRecordHierarchy(
    records.map((record, index) => results[index].data ?? record),
  );

  useEffect(() => {
    if (!hash || pending) {
      return;
    }
    let anchor: string;
    try {
      anchor = decodeURIComponent(hash.replace(/^#/, ''));
    } catch {
      return;
    }
    const target = document.getElementById(anchor);
    if (!target || !list.current?.contains(target)) {
      return;
    }
    let ancestor: HTMLElement | null = target;
    while (ancestor && list.current.contains(ancestor)) {
      ancestor
        .querySelector<HTMLButtonElement>(
          ':scope > .disclosure > .disclosure-header .disclosure-toggle[aria-expanded="false"]',
        )
        ?.click();
      ancestor = ancestor.parentElement;
    }
    const frame = requestAnimationFrame(() =>
      target.scrollIntoView({ block: 'center' }),
    );
    return () => cancelAnimationFrame(frame);
  }, [hash, pending]);

  return (
    <ol ref={list} className="person-status-list record-hierarchy">
      {hierarchy.map((node) => (
        <RecordNode key={node.key} node={node} renderRecord={renderRecord} />
      ))}
    </ol>
  );
}

function RecordNode({
  node,
  renderRecord,
}: {
  node: RecordHierarchyNode;
  renderRecord: RecordHierarchyProps['renderRecord'];
}) {
  const anchor = node.record.id && createObjectCardSplat(node.record.id);
  return (
    <li id={anchor ?? undefined}>
      {renderRecord(node.record)}
      {!!node.children.length && (
        <ol className="nested-list">
          {node.children.map((child) => (
            <RecordNode
              key={child.key}
              node={child}
              renderRecord={renderRecord}
            />
          ))}
        </ol>
      )}
    </li>
  );
}
