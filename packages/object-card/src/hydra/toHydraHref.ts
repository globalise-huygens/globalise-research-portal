import { createObjectCardPath } from '@globalise/common/uri';
import { toHref } from '@globalise/router';
import { HydraMember, isCollectionMember } from './HydraModel.ts';

export function toHydraHref(member: HydraMember): string {
  const uri = member['@id'];
  return isCollectionMember(member)
    ? toHref({ to: '/catalog', search: { uri } })
    : createObjectCardPath(uri) ?? uri;
}
