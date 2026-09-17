import { Virtuoso } from 'react-virtuoso';
import { Link } from '@tanstack/react-router';
import {
  CardArticle,
  ReferencePanelItem,
  ReferencePanelList,
} from '@globalise/design';
import {
  getLinkedArtEntityType,
  type LinkedArtEntityType,
} from '@globalise/common';
import { EntityTypeBadge } from '../linkedart';
import {
  getPageNumber,
  HydraCollection,
  HydraMember,
  isCollectionMember,
} from './HydraModel.ts';
import { useCollection } from './HydraSlice.ts';
import { getHydraHref, getHydraTarget } from './getHydraHref.ts';
import { Pagination } from './Pagination.tsx';
import './CollectionPage.css';

export function CatalogView() {
  const { collection, isReady, error } = useCollection();

  if (error) {
    return <div>Error: {error}</div>;
  }
  if (!isReady || !collection) {
    return <div>Loading...</div>;
  }

  const { title, totalItems, member, view } = collection;

  const memberType = getCatalogEntityType(collection['@id']);
  if (member.length > 0 && member.every(isCollectionMember)) {
    return <SchemaCatalog title={title} members={member}/>;
  }

  const shownItems = getShownItemsRange(collection);

  return (
    <section className='collection-page'>
      <header className='collection-header'>
        <h2>{title ?? 'Collection'}</h2>
        {!!totalItems && (
          <span className='collection-total'>
            {shownItems
              ? `${shownItems} of ${totalItems.toLocaleString()} items`
              : `${totalItems.toLocaleString()} items`}
          </span>
        )}
        <Pagination view={view}/>
      </header>
      <Virtuoso
        className='collection-list'
        data={member}
        components={{ List: ReferencePanelList }}
        itemContent={(index, item) => (
          <PageItem key={index} member={item} type={memberType}/>
        )}
      />
    </section>
  );
}

function getShownItemsRange(collection: HydraCollection): string | null {
  const { totalItems, member, view } = collection;
  if (!totalItems || !view) {
    return null;
  }
  const current = getPageNumber(view['@id']);
  const last = getPageNumber(view.last);
  if (!current || !last) {
    return null;
  }
  const pageSize = Math.ceil(totalItems / last);
  const start = (current - 1) * pageSize + 1;
  const end = start + member.length - 1;
  return `${start.toLocaleString()}-${end.toLocaleString()}`;
}

type PageItemProps = {
  member: HydraMember;
  type: LinkedArtEntityType;
};

function PageItem({ member, type }: PageItemProps) {
  const uri = member['@id'];
  const target = getHydraTarget(member);

  return (
    <ReferencePanelItem
      title={
        <Link {...target} className='collection-item-link'>
          {member.title ?? uri}
        </Link>
      }
      metadata={<EntityTypeBadge type={type}/>}
      href={getHydraHref(member)}
      hrefLabel='Open'
      uri={uri}
    />
  );
}

function getCatalogEntityType(uri: string): LinkedArtEntityType {
  const type = getLinkedArtEntityType(uri);
  return type === 'unknown' && uri.includes('/group:')
    ? 'organization'
    : type;
}

const conceptTypes: LinkedArtEntityType[] = [
  'concept',
  'conceptscheme',
  'collection',
];

const schemaTitles: Partial<Record<LinkedArtEntityType, string>> = {
  person: 'Person',
  place: 'Place',
  organization: 'Organisation',
  polity: 'Polity',
  rulership: 'Rulership',
  ship: 'Ship',
  voyage: 'Voyage',
  conversion: 'Conversion',
  occurrence: 'Occurrence',
  concept: 'Concept',
  conceptscheme: 'Concept scheme',
  collection: 'SKOS collection',
};

function SchemaCatalog({
  title,
  members,
}: {
  title?: string;
  members: HydraMember[];
}) {
  const schemas = members.map((member) => ({
    member,
    type: getCatalogEntityType(member['@id']),
  }));
  const entities = schemas.filter(({ type }) => !conceptTypes.includes(type));
  const concepts = schemas.filter(({ type }) => conceptTypes.includes(type));

  return (
    <main className='catalog-overview'>
      <header className='catalog-overview-header'>
        <span className='catalog-overview-eyebrow'>Browse the dataset</span>
        <h1>{title ?? 'Globalise Dataset Catalog'}</h1>
      </header>
      <SchemaGroup title='Entities' schemas={entities}/>
      <SchemaGroup title='Concepts' schemas={concepts}/>
    </main>
  );
}

function SchemaGroup({
  title,
  schemas,
}: {
  title: 'Entities' | 'Concepts';
  schemas: { member: HydraMember; type: LinkedArtEntityType }[];
}) {
  return (
    <section
      className='catalog-schema-group'
      aria-labelledby={`catalog-${title}`}
    >
      <h2 id={`catalog-${title}`}>{title}</h2>
      <div className='catalog-schema-grid'>
        {schemas.map(({ member, type }) => {
          const schemaTitle =
            schemaTitles[type] ?? member.title ?? member['@id'];

          return (
            <CardArticle
              key={member['@id']}
              href={getHydraHref(member)}
              label={title === 'Entities' ? 'Entity' : 'Concept'}
              title={schemaTitle}
              className={`catalog-schema-tile catalog-schema-tile--${type}`}
            />
          );
        })}
      </div>
    </section>
  );
}
