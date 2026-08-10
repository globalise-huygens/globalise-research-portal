import { ReactNode } from 'react';
import { ButtonLink, IconLeft, IconLeftFirst, IconRight, IconRightLast } from '@globalise/design';
import { getPageNumber, PartialCollectionView } from './HydraModel.ts';
import { getCollectionHref } from './getHydraHref.ts';

type PaginationProps = {
  view?: PartialCollectionView;
};

export function Pagination({ view }: PaginationProps) {
  if (!view) {
    return null;
  }
  const current = getPageNumber(view['@id']);
  const last = getPageNumber(view.last);

  return (
    <nav className="pagination" aria-label="Collection pages">
      <PageLink uri={view.first} label="First page">
        <IconLeftFirst/>
      </PageLink>
      <PageLink uri={view.previous} label="Previous page">
        <IconLeft/>
      </PageLink>
      {!!current && (
        <span className="pagination-position">
          {last ? `Page ${current} of ${last}` : `Page ${current}`}
        </span>
      )}
      <PageLink uri={view.next} label="Next page">
        <IconRight/>
      </PageLink>
      <PageLink uri={view.last} label="Last page">
        <IconRightLast/>
      </PageLink>
    </nav>
  );
}

type PageLinkProps = {
  uri?: string;
  label: string;
  children: ReactNode;
};

function PageLink({ uri, label, children }: PageLinkProps) {
  if (!uri) {
    return null;
  }
  return (
    <ButtonLink
      href={getCollectionHref(uri)}
      aria-label={label}
      size="sm"
      variant="outline"
    >
      {children}
    </ButtonLink>
  );
}
