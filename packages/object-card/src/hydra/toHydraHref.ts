import { toHref } from '@globalise/router';
import { HydraMember, isCollectionMember } from './HydraModel.ts';

export function toHydraHref(member: HydraMember): string {
  const uri = member['@id'];
  return isCollectionMember(member)
    ? toHref({ to: '/catalog', search: { uri } })
    : toHref({ to: '/object-card', search: { uri } });
}
