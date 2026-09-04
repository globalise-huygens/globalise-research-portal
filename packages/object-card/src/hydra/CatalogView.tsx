import { Virtuoso } from 'react-virtuoso';
import { Link, useNavigate } from '@tanstack/react-router';
import {
  IconEast,
  IconArrowTopRight,
  ObjectCard,
  ObjectCardBody,
  ObjectCardHeader,
  ObjectCardAction,
  ObjectCardTitle,
  ReferencePanelItem,
  ReferencePanelList,
} from '@globalise/design';
import {
  getLinkedArtEntityType,
  type LinkedArtEntityType,
} from '@globalise/common';
import { EntityTypeBadge } from '../linkedart';
import { HydraMember } from './HydraModel.ts';
import { loadNextCatalogPage, useCollection } from './HydraSlice.ts';
import { getHydraTarget } from './getHydraHref.ts';
import { useNavigateToObjectCard } from '../useNavigateToObjectCard.ts';
import './CollectionPage.css';

export function CatalogView() {
  const { collection, isReady, error } = useCollection();
  const navigate = useNavigate();

  if (error) {
    return <div>Error: {error}</div>;
  }
  if (!isReady || !collection) {
    return <div>Loading...</div>;
  }

  const { title, totalItems, member } = collection;

  const memberType = getLinkedArtEntityType(collection['@id']);

  if (memberType === 'unknown') {
    return <SchemaCatalog title={title} members={member}/>;
  }

  return (
    <ObjectCard className='collection-page'>
      <ObjectCardHeader
        onClose={() => { void navigate({ to: '/catalog' }); }}
      >
        <div className='collection-title'>
          <ObjectCardTitle>{title ?? 'Collection'}</ObjectCardTitle>
          <EntityTypeBadge type={memberType}/>
        </div>
        {!!totalItems && (
          <span className='collection-total'>
            {totalItems.toLocaleString()} items
          </span>
        )}
      </ObjectCardHeader>
      <ObjectCardBody>
        <Virtuoso
          className='collection-list'
          data={member}
          endReached={() => { void loadNextCatalogPage(); }}
          components={{ List: ReferencePanelList }}
          itemContent={(index, item) => (
            <PageItem key={index} member={item}/>
          )}
        />
      </ObjectCardBody>
    </ObjectCard>
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

type PageItemProps = {
  member: HydraMember;
};

function PageItem({ member }: PageItemProps) {
  const uri = member['@id'];
  const openObjectCard = useNavigateToObjectCard();

  return (
    <ReferencePanelItem
      title={
        <ObjectCardAction
          className='collection-item-link'
          icon={<IconArrowTopRight aria-hidden='true'/>}
          onPress={() => openObjectCard(uri)}
        >
          {getMemberLabel(member)}
        </ObjectCardAction>
      }
    />
  );
}

function getMemberLabel(member: HydraMember): string {
  const appellations = Array.isArray(member.ascribes_appellation)
    ? member.ascribes_appellation
    : member.ascribes_appellation ? [member.ascribes_appellation] : [];
  const content = appellations.find((appellation) => appellation.content?.trim())?.content;
  if (content?.trim()) {
    return content.trim();
  }
  const title = member.title?.trim();
  if (title) {
    return title;
  }
  const uri = member['@id'];
  const lastPart = uri.split('/').pop();
  return lastPart ? decodeURIComponent(lastPart) : uri;
}
