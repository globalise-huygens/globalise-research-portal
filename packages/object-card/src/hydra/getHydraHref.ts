import { HydraMember } from './HydraModel.ts';

export function getHydraHref(member: HydraMember): string {
  return `/catalog?uri=${encodeURIComponent(member['@id'])}`;
}

export function getHydraTarget(member: HydraMember) {
  return { to: '/catalog', search: { uri: member['@id'] } } as const;
}

export function getCollectionHref(uri: string): string {
  return `/catalog?uri=${encodeURIComponent(uri)}`;
}
