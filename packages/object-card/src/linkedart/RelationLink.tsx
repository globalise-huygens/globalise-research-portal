import {
  PreviewCard,
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
import { useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { isInternalUri } from '../isInternalUri.ts';
import { getRelationValue, getResolvedRelationValue } from './RelationValueModel.ts';
import { entityResourceQueryOptions } from './RelationValueResolver.ts';
import { getResourcePreview } from './ResourcePreviewModel.ts';

type RelationLinkProps = {
  node: LinkedArtNode;
  resolveExternal?: boolean;
};

export function RelationLink({
  node, resolveExternal = true, label, previewOnDemand = false,
}: RelationLinkProps & { label?: string; previewOnDemand?: boolean }) {
  const href = url(node);
  const [hasOpened, setHasOpened] = useState(false);
  const loadResource = !previewOnDemand || hasOpened;
  const { text, resource, isPending } = useRelationValue(
    node, href, resolveExternal, loadResource,
  );
  const linkLabel = label ?? text;

  if (!href) {
    return <span className="relation">{linkLabel}</span>;
  }

  // The recorded reference can open the card before its details are fetched.
  const previewResource = resource ?? (previewOnDemand ? node : undefined);
  const preview = previewResource
    ? getResourcePreview(previewResource, href, renderRelatedNodes)
    : undefined;

  function handleOpenChange(open: boolean) {
    if (open) {
      setHasOpened(true);
    }
  }

  return (
    <PreviewCard
      data={preview}
      isPending={isPending}
      onOpenChange={previewOnDemand ? handleOpenChange : undefined}
    >
      {(attributes) => isInternalUri(href) ? (
        <EntityTag
          {...attributes}
          type={getEntityTagType(getLinkedArtEntityType(href))}
          href={toHref({ to: '/object-card', search: { uri: href } })}
        >
          {linkLabel}
        </EntityTag>
      ) : (
        <ObjectCardExternalLink {...attributes} href={href}>
          {linkLabel}
        </ObjectCardExternalLink>
      )}
    </PreviewCard>
  );
}

export function RelationValue({
  node, render, resolveExternal = true,
}: RelationLinkProps & { render?: (text: string) => ReactNode }) {
  const { text } = useRelationValue(node, url(node), resolveExternal);
  return <>{render ? render(text) : text}</>;
}

function renderRelatedNodes(nodes: LinkedArtNode[]) {
  return nodes.map((node, index) => (
    <span key={node.id ?? index}>
      {index > 0 && ', '}
      <RelationLink node={node} />
    </span>
  ));
}

function useRelationValue(
  node: LinkedArtNode,
  targetHref?: string,
  resolveExternal = true,
  loadResource = true,
) {
  const shouldResolve = targetHref
    && (resolveExternal || isInternalUri(targetHref));
  const href = shouldResolve ? targetHref : undefined;
  const safeFallback = getRelationValue(node);
  const pendingValue = href ? getRelationValue({ ...node, id: undefined, _label: undefined }) : safeFallback;
  const { data: resource, isPending } = useQuery({
    ...entityResourceQueryOptions(href ?? ''),
    enabled: Boolean(href) && loadResource,
  });
  return {
    resource: resource ?? undefined,
    isPending: Boolean(href) && loadResource && isPending,
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
