import { Virtuoso } from 'react-virtuoso';
import { Link } from '@tanstack/react-router';
import {
  IconEast,
  ReferencePanelItem,
  ReferencePanelList,
} from '@globalise/design';
import {
  getLinkedArtEntityType,
  type LinkedArtEntityType,
} from '@globalise/common';
import { EntityTypeBadge } from '../linkedart';
import { getPageNumber, HydraCollection, HydraMember } from './HydraModel.ts';
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

  const memberType = getLinkedArtEntityType(collection['@id']);

  if (memberType === 'unknown') {
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
    type: getLinkedArtEntityType(member['@id']),
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
            <Link
              key={member['@id']}
              {...getHydraTarget(member)}
              aria-label={`Open ${schemaTitle} collection`}
              className='catalog-schema-tile'
              data-schema={type}
            >
              <span className='catalog-schema-tile-header'>
                <span className='catalog-schema-tile-category'>
                  {title === 'Entities' ? 'Entity' : 'Concept'}
                </span>
                <span className='catalog-schema-tile-title'>{schemaTitle}</span>
              </span>
              <IconEast
                className='catalog-schema-tile-icon'
                aria-hidden='true'
              />
            </Link>
          );
        })}
      </div>
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
