import { useEffect, useMemo } from 'react';
import {
  findByPath,
  loadMetadata,
  type LinkedArtNode,
  type MetadataState,
} from '@globalise/common';
import { useDocumentStore } from '@globalise/common/document';
import type { PanelData } from './PanelData.ts';
import {
  toNerCategoryTotals,
  type NerCategoryTotals,
} from './toNerCategoryGroups.ts';

/**
 * NER category totals of document metadata: its text is referred to
 * by an annotations set, which has an annotation collection per NER category.
 */
export function useNerCategoryTotals(
  documentMetadata: PanelData<LinkedArtNode>,
): PanelData<NerCategoryTotals> {
  const metadata = useDocumentStore((s) => s.metadata);
  const urls = useMemo(
    () => documentMetadata.status === 'ready'
      ? findAnnotationsUrls(documentMetadata.data, metadata)
      : [],
    [documentMetadata, metadata],
  );

  useEffect(loadAnnotations, [urls]);

  function loadAnnotations() {
    for (const url of urls) {
      loadMetadata(url)
        .catch(console.error);
    }
  }

  return useMemo(
    () => documentMetadata.status === 'ready'
      ? findTotals(urls, metadata)
      : documentMetadata,
    [documentMetadata, urls, metadata],
  );
}

/**
 * Annotations url and annotation collection urls
 */
function findAnnotationsUrls(
  documentMetadata: LinkedArtNode,
  metadata: Record<string, MetadataState>,
): string[] {
  const path = ['carries', 'referred_to_by'];
  const [annotations] = findByPath(documentMetadata, path);
  const annotationUrl = annotations?.id;
  if (!annotationUrl) {
    return [];
  }
  const annotationSet = metadata[annotationUrl]?.root;
  if (!annotationSet) {
    return [annotationUrl];
  }
  const nerCategoryUrls = findByPath(annotationSet, ['member'])
    .flatMap((member) => member.id ?? []);
  return [annotationUrl, ...nerCategoryUrls];
}

export function findTotals(
  urls: string[],
  metadata: Record<string, MetadataState>,
): PanelData<NerCategoryTotals> {
  if (!urls.length || urls.some((url) => metadata[url]?.error)) {
    return { status: 'failed' };
  }
  const roots = urls.flatMap((url) => metadata[url]?.root ?? []);
  if (roots.length < urls.length) {
    return { status: 'loading' };
  }
  const [, ...collections] = roots;
  return { status: 'ready', data: toNerCategoryTotals(collections) };
}
