import { findByPath, type LinkedArtNode } from '@globalise/common';
import {
  getEntitySubject,
  type EntityBody,
} from '@globalise/common/annotation';
import { createObjectCardPath, isInternalUri, thesaurusBase } from '@globalise/common/uri';

export function getInternalConceptUri(uri: string): string | undefined {
  if (isInternalUri(uri) && uri.includes('/thesaurus:')) {
    return uri.replace(/\.json$/, '');
  }
  try {
    const parsed = new URL(uri);
    const poolPartyMatch = parsed.hostname === 'digitaalerfgoed.poolparty.biz'
      ? /^\/globalise\/([0-9a-f-]+)\/?$/i.exec(parsed.pathname)
      : null;
    return poolPartyMatch
      ? `${thesaurusBase}${poolPartyMatch[1]}`
      : undefined;
  } catch {
    return undefined;
  }
}

export function getLinkedObjectCardHref(body: EntityBody): string | undefined {
  const subject = getEntitySubject(body);
  const uri = getEquivalentTarget(subject)?.id ?? subject?.id;
  if (!uri || uri.includes('#') || uri.includes('/annotations:')) {
    return undefined;
  }
  return createObjectCardPath(uri) ?? undefined;
}

export function getEquivalentTarget(node?: LinkedArtNode): LinkedArtNode | undefined {
  if (!node) {
    return undefined;
  }
  const matches = findByPath(node, ['is_similarity_subject_of'])
    .filter((status) => status.ascribes_similarity_relation === 'la:equivalent')
    .flatMap((status) => findByPath(status, ['ascribes_similarity_target']))
    .filter((target) => !!target.id);
  const targets = new Map(matches.map((target) => [target.id, target]));
  if (targets.size !== 1) {
    return undefined;
  }
  return targets.values().next().value;
}
