import { toHref } from '@globalise/router';
import {
  getEntitySubject,
  type EntityBody,
} from '@globalise/common/annotation';
import { thesaurusBase } from '@globalise/common/uri';

const GLOBALISE_DATA_ORIGIN = 'https://data.globalise.huygens.knaw.nl';

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
      ? `${thesaurusBase}${poolPartyMatch[1]}`
      : undefined;
  } catch {
    return undefined;
  }
}

export function getLinkedObjectCardHref(body: EntityBody): string | undefined {
  const subject = getEntitySubject(body);
  const uri = subject?.id;
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
