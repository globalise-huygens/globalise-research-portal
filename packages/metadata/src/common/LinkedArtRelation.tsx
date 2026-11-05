import {
  fetchLinkedArtResource,
  getLinkedArtEntityType,
  label,
  url,
  type LinkedArtEntityType,
  type LinkedArtNode,
} from '@globalise/common';
import { EntityTag, ObjectCardExternalLink, type EntityTagType } from '@globalise/design';
import { toHref } from '@globalise/router';
import { useQuery } from '@tanstack/react-query';
import type { ReactNode } from 'react';

type LinkedArtRelationProps = {
  node: LinkedArtNode;
  render?: (label: string, href: string | undefined) => ReactNode;
};

export function LinkedArtRelation({ node, render }: LinkedArtRelationProps) {
  const uri = url(node);
  const { data } = useQuery({
    queryKey: ['metadata-linked-art-resource', uri],
    enabled: !!uri,
    staleTime: Infinity,
    retry: false,
    queryFn: async ({ signal }) => uri ? fetchLinkedArtResource(uri, signal) : undefined,
  });
  const text = label(data ?? node);
  const href = getRelationHref(uri);

  if (render) {
    return render(text, href);
  }
  if (!uri || !href) {
    return <>{text}</>;
  }
  if (isInternalUri(uri)) {
    return (
      <EntityTag
        type={getEntityTagType(getLinkedArtEntityType(uri))}
        href={href}
      >
        {text}
      </EntityTag>
    );
  }
  return <ObjectCardExternalLink href={href}>{text}</ObjectCardExternalLink>;
}

function getRelationHref(uri?: string): string | undefined {
  if (!uri) {
    return undefined;
  }
  return isInternalUri(uri)
    ? toHref({ to: '/object-card', search: { uri } })
    : uri;
}

function isInternalUri(uri: string): boolean {
  return new URL(uri).hostname === 'data.globalise.huygens.knaw.nl';
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
