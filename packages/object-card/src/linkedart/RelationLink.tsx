import {
  EntityTag,
  type EntityTagType,
  ObjectCardExternalLink,
} from '@globalise/design';
import {
  getLinkedArtEntityType,
  type LinkedArtEntityType,
  type LinkedArtNode,
  url,
} from '@globalise/common';
import { toHref } from '@globalise/router';
import { type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { isInternalUri } from '../isInternalUri.ts';
import { getRelationValue } from './RelationValueModel.ts';
import { relationValueQueryOptions } from './RelationValueResolver.ts';

type RelationLinkProps = {
  node: LinkedArtNode;
};

export function RelationLink({ node }: RelationLinkProps) {
  const href = url(node);
  const text = useRelationValue(node, href);

  if (href && isInternalUri(href)) {
    return (
      <EntityTag
        type={getEntityTagType(getLinkedArtEntityType(href))}
        href={toHref({ to: '/object-card', search: { uri: href } })}
      >
        {text}
      </EntityTag>
    );
  }
  if (href) {
    return (
      <ObjectCardExternalLink href={href}>{text}</ObjectCardExternalLink>
    );
  }
  return <span className="relation">{text}</span>;
}

export function RelationValue({ node, render }: RelationLinkProps & { render?: (text: string) => ReactNode }) {
  const text = useRelationValue(node, url(node));
  return <>{render ? render(text) : text}</>;
}

function useRelationValue(node: LinkedArtNode, href?: string): string {
  const safeFallback = getRelationValue(node);
  const pendingValue = href ? getRelationValue({ ...node, id: undefined, _label: undefined }) : safeFallback;
  const { data, isPending } = useQuery(relationValueQueryOptions(href ?? ''));
  return isPending ? pendingValue : data ?? safeFallback;
}

function getEntityTagType(type: LinkedArtEntityType): EntityTagType {
  switch (type) {
    case 'organization':
      return 'organisation';
    case 'conceptscheme':
    case 'collection':
      return 'concept';
    case 'unknown':
      return 'document';
    default:
      return type;
  }
}
