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
import { type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { isInternalUri } from '../isInternalUri.ts';
import { getRelationValue, getResolvedRelationValue } from './RelationValueModel.ts';
import { entityResourceQueryOptions } from './RelationValueResolver.ts';
import { getResourcePreview } from './ResourcePreviewModel.ts';
import { ResourcePreview } from './ResourcePreview.tsx';

type RelationLinkProps = {
  node: LinkedArtNode;
};

export function RelationLink({ node }: RelationLinkProps) {
  const href = url(node);
  const { text, resource } = useRelationValue(node, href);
  const preview = resource && href ? getResourcePreview(resource, href, (nodes) => nodes.map((related, index) => (
    <span key={related.id ?? index}>
      {index > 0 && ', '}
      <RelationValue node={related} render={(label) => {
        const uri = url(related);
        return uri && isInternalUri(uri)
          ? <EntityTag type="concept" href={`/object-card?${new URLSearchParams({ uri })}`}>{label}</EntityTag>
          : uri ? <ObjectCardExternalLink href={uri}>{label}</ObjectCardExternalLink> : label;
      }} />
    </span>
  ))) : undefined;

  if (href && isInternalUri(href)) {
    return <ResourcePreview data={preview}>{(attributes) => (
      <EntityTag
        {...attributes}
        type={getEntityTagType(getLinkedArtEntityType(href))}
        href={`/object-card?${new URLSearchParams({ uri: href })}`}
      >
        {text}
      </EntityTag>
    )}</ResourcePreview>;
  }
  if (href) {
    return <ResourcePreview data={preview}>{(attributes) => (
      <ObjectCardExternalLink {...attributes} href={href}>{text}</ObjectCardExternalLink>
    )}</ResourcePreview>;
  }
  return <span className="relation">{text}</span>;
}

export function RelationValue({ node, render }: RelationLinkProps & { render?: (text: string) => ReactNode }) {
  const { text } = useRelationValue(node, url(node));
  return <>{render ? render(text) : text}</>;
}

function useRelationValue(node: LinkedArtNode, href?: string) {
  const safeFallback = getRelationValue(node);
  const pendingValue = href ? getRelationValue({ ...node, id: undefined, _label: undefined }) : safeFallback;
  const { data: resource, isPending } = useQuery(entityResourceQueryOptions(href ?? ''));
  return {
    resource: resource ?? undefined,
    text: isPending ? pendingValue : getResolvedRelationValue(resource ?? undefined) ?? safeFallback,
  };
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
