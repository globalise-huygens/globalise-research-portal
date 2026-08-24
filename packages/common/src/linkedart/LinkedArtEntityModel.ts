import { LinkedArtNode } from './LinkedArtNode.ts';
import { findByPath } from './findByPath.ts';
import { findStatuses, getStatusLabel } from './findStatuses.ts';
import { label } from './label.ts';
import { getContent } from './getContent.ts';

export const linkedArtEntityTypes = [
  'person',
  'place',
  'organization',
  'polity',
  'rulership',
  'ship',
  'voyage',
  'conversion',
  'occurrence',
  'concept',
  'conceptscheme',
  'collection',
] as const;

export type LinkedArtEntityType =
  | (typeof linkedArtEntityTypes)[number]
  | 'unknown';

const thesaurusSegment = 'thesaurus';

const pagePattern = /^(.+)-page-\d+\.json$/;

export function getLinkedArtEntityType(uri?: string): LinkedArtEntityType {
  const parts = uri?.split('/') ?? [];
  const pageType = pagePattern.exec(parts[parts.length - 1] ?? '')?.[1];
  const named = parts.filter((part) => part.includes(':'));
  const [segment, identifier] = named[named.length - 1]?.split(':') ?? [];

  return (
    toEntityType(pageType)
    ?? linkedArtEntityTypes.find((type) =>
      new RegExp(`(?:^|[_-])${type}(?:[_-]|\\d)`, 'i').test(identifier ?? ''),
    )
    ?? toEntityType(segment)
    ?? (segment === thesaurusSegment ? 'concept' : 'unknown')
  );
}

export function getEntityTitle(entity: LinkedArtNode): string {
  const [name] = findStatuses(entity, 'is_appellative_subject_of')
    .map(getStatusLabel)
    .filter((found) => !!found);
  return name ?? label(entity);
}

export function getEntityIdentifiers(entity: LinkedArtNode): string[] {
  return findByPath(entity, ['identified_by'])
    .map(getContent)
    .filter((found) => !!found);
}

function toEntityType(name?: string): LinkedArtEntityType | undefined {
  const found = name?.toLowerCase();
  return linkedArtEntityTypes.find((type) => type === found);
}
