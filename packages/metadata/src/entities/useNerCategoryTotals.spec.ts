import { describe, expect, it } from 'vitest';
import type { MetadataState } from '@globalise/common';
import { findTotals } from './useNerCategoryTotals.ts';

describe(findTotals.name, () => {
  const setUrl = 'document:foo.annotations';
  const collectionUrl = 'document:foo.annotations.per_name';
  const urls = [setUrl, collectionUrl];
  const emptyState = { root: null, isLoading: false, isReady: false };
  const toReady = (root: MetadataState['root']): MetadataState => ({
    ...emptyState,
    root,
    isReady: true,
    error: null,
  });
  const set = toReady({ id: setUrl, type: 'Set' });
  const collection = toReady({
    id: collectionUrl,
    type: 'AnnotationCollection',
    total: 3,
  });

  it('finds totals when all urls are loaded', () => {
    const metadata = { [setUrl]: set, [collectionUrl]: collection };
    expect(findTotals(urls, metadata)).toEqual({
      status: 'ready',
      data: new Map([['ner:per_name', 3]]),
    });
  });

  it('is loading while a url has not been loaded', () => {
    expect(findTotals(urls, { [setUrl]: set })).toEqual({ status: 'loading' });
  });

  it('fails when a url failed to load', () => {
    const failed = { ...emptyState, error: '403' };
    const metadata = { [setUrl]: set, [collectionUrl]: failed };
    expect(findTotals(urls, metadata)).toEqual({ status: 'failed' });
  });

  it('fails when the metadata refers to no annotations', () => {
    expect(findTotals([], {})).toEqual({ status: 'failed' });
  });
});
