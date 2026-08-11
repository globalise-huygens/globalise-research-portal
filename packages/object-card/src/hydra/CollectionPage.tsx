import { Virtuoso } from 'react-virtuoso';
import {
  ReferencePanelItem,
  ReferencePanelList,
} from '@globalise/design';
import {
  getLinkedArtEntityType,
  type LinkedArtEntityType,
} from '@globalise/common';
import { EntityTypeBadge } from '../linkedart';
import { HydraMember } from './HydraModel.ts';
import { useCollection } from './HydraSlice.ts';
import { getHydraHref } from './getHydraHref.ts';
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

  return (
    <section className="collection-page">
      <header className="collection-header">
        <h2>{title ?? 'Collection'}</h2>
        {!!totalItems && (
          <span className="collection-total">
            {totalItems.toLocaleString()} items
          </span>
        )}
        <Pagination view={view}/>
      </header>
      <Virtuoso
        className="collection-list"
        data={member}
        components={{ List: ReferencePanelList }}
        itemContent={(index, item) => (
          <PageItem key={index} member={item} type={memberType}/>
        )}
      />
    </section>
  );
}

type PageItemProps = {
  member: HydraMember;
  type: LinkedArtEntityType;
};

function PageItem({ member, type }: PageItemProps) {
  const uri = member['@id'];

  return (
    <ReferencePanelItem
      title={member.title ?? uri}
      metadata={<EntityTypeBadge type={type}/>}
      href={getHydraHref(member)}
      hrefLabel="Open"
      uri={uri}
    />
  );
}
