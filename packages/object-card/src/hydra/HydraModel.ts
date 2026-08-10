export const catalogUri =
  'https://data.globalise.huygens.knaw.nl/hdl:20.500.14722/catalog.json';

export type HydraMember = {
  '@id': string;
  '@type'?: string;
  title?: string;
};

export type PartialCollectionView = {
  '@id': string;
  '@type': 'PartialCollectionView';
  first?: string;
  last?: string;
  next?: string;
  previous?: string;
};

export type HydraCollection = {
  '@id': string;
  '@type': 'Collection';
  title?: string;
  totalItems?: number;
  member: HydraMember[];
  view?: PartialCollectionView;
};

export function isHydraCollection(value: unknown): value is HydraCollection {
  return (
    !!value
    && typeof value === 'object'
    && '@type' in value
    && value['@type'] === 'Collection'
    && 'member' in value
  );
}

export function isCollectionMember(member: HydraMember): boolean {
  return member['@id'].endsWith('.json');
}

const pageNumberPattern = /page-(\d+)\.json$/;

export function getPageNumber(url?: string): number | undefined {
  const found = pageNumberPattern.exec(url ?? '')?.[1];
  return found ? Number(found) : undefined;
}
