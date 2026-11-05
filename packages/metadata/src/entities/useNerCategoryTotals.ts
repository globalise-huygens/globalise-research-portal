import { useEffect, useMemo } from 'react';
import {
  findByPath,
  loadMetadata,
  type LinkedArtNode,
  type MetadataState,
} from '@globalise/common';
import { useDocumentStore } from '@globalise/common/document';
import {
  toNerCategoryTotals,
  type NerCategoryTotals,
} from './toNerCategoryGroups.ts';

/**
 * NER category totals of document metadata: its text is referred to
 * by an annotations set, which has an annotation collection per NER category.
 * Unavailable while loading or when any of these fails to load.
 */
export function useNerCategoryTotals(
  documentMetadata: LinkedArtNode | null,
): NerCategoryTotals | undefined {
  const metadata = useDocumentStore((s) => s.metadata);
  const urls = useMemo(
    () => findAnnotationsUrls(documentMetadata, metadata),
    [documentMetadata, metadata],
  );

  useEffect(loadAnnotations, [urls]);

  function loadAnnotations() {
    for (const url of urls) {
      loadMetadata(url)
        .catch(console.error);
    }
  }

  return useMemo(() => findTotals(urls, metadata), [urls, metadata]);
}

/**
 * Annotations url and annotation collection urls
 */
function findAnnotationsUrls(
  documentMetadata: LinkedArtNode | null,
  metadata: Record<string, MetadataState>,
): string[] {
  if (!documentMetadata) {
    return [];
  }
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

function findTotals(
  urls: string[],
  metadata: Record<string, MetadataState>,
): NerCategoryTotals | undefined {
  const roots = urls.flatMap((url) => metadata[url]?.root ?? []);
  if (!urls.length || roots.length < urls.length) {
    return undefined;
  }
  const [, ...collections] = roots;
  return toNerCategoryTotals(collections);
}
