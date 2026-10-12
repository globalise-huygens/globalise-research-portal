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
import { getRelationValue } from './RelationValueModel.ts';
import { resolveRelationValue } from './RelationValueResolver.ts';
import { useNavigateToObjectCard } from '../useNavigateToObjectCard.ts';

type RelationLinkProps = {
  node: LinkedArtNode;
};

export function RelationLink({ node }: RelationLinkProps) {
  const navigateToObjectCard = useNavigateToObjectCard();
  const href = url(node);
  const text = useRelationValue(node, href);

  if (href && isInternalUri(href)) {
    return (
      <EntityTag
        type={getEntityTagType(getLinkedArtEntityType(href))}
        onPress={() => navigateToObjectCard(href)}
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
  const [resolved, setResolved] = useState<{
    uri: string;
    value?: string;
  }>();

  useEffect(() => {
    if (!href) {
      return;
    }
    let active = true;
    void resolveRelationValue(href).then((value) => {
      if (active) {
        setResolved({ uri: href, value });
      }
    });
    return () => {
      active = false;
    };
  }, [href]);

  return resolved && resolved.uri === href
    ? resolved.value ?? safeFallback
    : pendingValue;
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
