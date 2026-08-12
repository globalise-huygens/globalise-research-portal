import { HydraMember, isCollectionMember } from './HydraModel.ts';

/**
 * Collections are browsed on the catalog page,
 * everything else opens as an object card.
 */
export function getHydraHref(member: HydraMember): string {
  const page = isCollectionMember(member) ? '/catalog' : '/object-card';
  return `${page}?uri=${encodeURIComponent(member['@id'])}`;
}

export function getHydraTarget(member: HydraMember) {
  const to = isCollectionMember(member) ? '/catalog' : '/object-card';
  return { to, search: { uri: member['@id'] } } as const;
}

export function getCollectionHref(uri: string): string {
  return `/catalog?uri=${encodeURIComponent(uri)}`;
}
