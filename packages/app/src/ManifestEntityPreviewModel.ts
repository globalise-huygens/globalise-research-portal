import { findByPath, isLinkedArtNode } from '@globalise/common';
import { toHref } from '@globalise/router';
import {
  getEntitySubject,
  type EntityBody,
} from '@globalise/common/annotation';

const GLOBALISE_DATA_ORIGIN = 'https://data.globalise.huygens.knaw.nl';
const GLOBALISE_THESAURUS_BASE =
  `${GLOBALISE_DATA_ORIGIN}/hdl:20.500.14722/thesaurus:`;

export function getInternalConceptUri(uri: string): string | undefined {
  try {
    const parsed = new URL(uri);
    if (
      parsed.protocol === 'https:'
      && parsed.origin === GLOBALISE_DATA_ORIGIN
      && parsed.pathname.includes('/thesaurus:')
    ) {
      return uri.replace(/\.json$/, '');
    }
    const poolPartyMatch = parsed.hostname === 'digitaalerfgoed.poolparty.biz'
      ? /^\/globalise\/([0-9a-f-]+)\/?$/i.exec(parsed.pathname)
      : null;
    return poolPartyMatch
      ? `${GLOBALISE_THESAURUS_BASE}${poolPartyMatch[1]}`
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
  try {
    const parsed = new URL(uri);
    if (parsed.protocol !== 'https:' || parsed.origin !== GLOBALISE_DATA_ORIGIN) {
      return undefined;
    }
  } catch {
    return undefined;
  }
  return getObjectCardHref(uri);
}

export function getObjectCardHref(uri: string): string {
  return toHref({ to: '/object-card', search: { uri } });
}

export function getEquivalentTarget(value: unknown) {
  if (!isLinkedArtNode(value)) {
    return undefined;
  }
  const matches = findByPath(value, ['is_similarity_subject_of'])
    .filter((status) => status.ascribes_similarity_relation === 'la:equivalent')
    .flatMap((status) => findByPath(status, ['ascribes_similarity_target']))
    .filter((target) => !!target.id);
  const targets = new Map(matches.map((target) => [target.id, target]));
  if (targets.size !== 1) {
    return undefined;
  }
  return [...targets.values()][0];
}
