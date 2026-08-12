import { Virtuoso } from 'react-virtuoso';
import { Link } from '@tanstack/react-router';
import {
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

export function CollectionPage() {
  const { collection, isReady, error } = useCollection();

  if (error) {
    return <div>Error: {error}</div>;
  }
  if (!isReady || !collection) {
    return <div>Loading...</div>;
  }

  const { title, totalItems, member, view } = collection;

  const memberType = getLinkedArtEntityType(collection['@id']);
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