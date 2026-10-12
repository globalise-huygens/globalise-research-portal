import {
  EntityTag,
  type EntityTagType,
  ObjectCardExternalLink,
  EntityPreviewCard,
  Tooltip,
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
import './ResourcePreview.css';

type RelationLinkProps = {
  node: LinkedArtNode;
};

export function RelationLink({ node }: RelationLinkProps) {
  const href = url(node);
  const { text, resource } = useRelationValue(node, href);
  const preview = resource && href ? getResourcePreview(resource, href) : undefined;
  // Keep the trigger mounted while its resource resolves, preserving keyboard focus.
  const withPreview = (link: ReactNode) => (
    <Tooltip
      label={preview ? <EntityPreviewCard data={preview} /> : null}
      isDisabled={!preview}
      className="gds resource-preview"
      placement="right"
      delay={350}
      closeDelay={200}
    >
      {link}
    </Tooltip>
  );

  if (href && isInternalUri(href)) {
    return withPreview(
      <EntityTag
        type={getEntityTagType(getLinkedArtEntityType(href))}
        href={`/object-card?${new URLSearchParams({ uri: href })}`}
      >
        {text}
      </EntityTag>,
    );
  }
  if (href) {
    return withPreview(
      <ObjectCardExternalLink href={href}>{text}</ObjectCardExternalLink>,
    );
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
