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
import { type ReactNode, useEffect, useState } from 'react';
import { isInternalUri } from '../isInternalUri.ts';
import { getRelationValue, getResolvedRelationValue } from './RelationValueModel.ts';
import { resolveRelationResource } from './RelationValueResolver.ts';
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
      <RelationLink node={related} />
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
  const [resolved, setResolved] = useState<{
    uri: string;
    resource?: LinkedArtNode;
  }>();

  useEffect(() => {
    if (!href) {
      return;
    }
    let active = true;
    void resolveRelationResource(href).then((resource) => {
      if (active) {
        setResolved({ uri: href, resource });
      }
    });
    return () => {
      active = false;
    };
  }, [href]);

  const isResolved = resolved && resolved.uri === href;
  const resource = isResolved ? resolved.resource : undefined;
  return {
    resource,
    text: isResolved ? getResolvedRelationValue(resource) ?? safeFallback : pendingValue,
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
