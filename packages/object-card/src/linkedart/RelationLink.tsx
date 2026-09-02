import {
  EntityTag,
  type EntityTagType,
  ObjectCardExternalLink,
} from '@globalise/design';
import {
  asArray,
  fetchJson,
  findByPath,
  getContent,
  getJsonUrl,
  getLinkedArtEntityType,
  getValue,
  getValues,
  isLinkedArtNode,
  type LinkedArtEntityType,
  type LinkedArtNode,
  url,
} from '@globalise/common';
import { useEffect, useState } from 'react';
import { isInternalUri } from '../isInternalUri.ts';
import { useNavigateToObjectCard } from '../useNavigateToObjectCard.ts';

type RelationLinkProps = {
  node: LinkedArtNode;
};

const relationValueRequests = new Map<
  string,
  Promise<string | undefined>
>();

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

export function RelationValue({ node }: RelationLinkProps) {
  return <>{useRelationValue(node, url(node))}</>;
}

function getFirstValue(...values: (string | undefined)[]): string {
  return values.find((value) => !!value) ?? '';
}

function useRelationValue(node: LinkedArtNode, href?: string): string {
  const fallback = getNodeValue(node);
  const internalUri = href && isInternalUri(href) ? href : undefined;
  // Temporary fallback until all internal entity IDs resolve.
  const temporaryLabelFallback = getValue(node._label);
  const safeFallback = internalUri
    ? getFirstValue(
      isInternalUri(fallback) ? undefined : fallback,
      temporaryLabelFallback,
      node.type,
    )
    : fallback;
  const [resolved, setResolved] = useState<{
    uri: string;
    value: string;
  }>();

  useEffect(() => {
    if (!internalUri) {
      return;
    }
    let active = true;
    void resolveRelationValue(internalUri).then((value) => {
      if (active && value) {
        setResolved({ uri: internalUri, value });
      }
    });
    return () => {
      active = false;
    };
  }, [internalUri]);

  return resolved && resolved.uri === internalUri
    ? resolved.value
    : safeFallback;
}

function resolveRelationValue(uri: string): Promise<string | undefined> {
  const existing = relationValueRequests.get(uri);
  if (existing) {
    return existing;
  }
  const request = fetchJson<unknown>(getJsonUrl(uri))
    .then((value) => isLinkedArtNode(value) ? getNodeValue(value) : undefined)
    .catch(() => undefined);
  relationValueRequests.set(uri, request);
  return request;
}

function getNodeValue(node: LinkedArtNode): string {
  const typeLabels = node.type === 'Type' ? getValues(node._label) : [];
  return getFirstValue(
    getContent(node),
    getValue(node.value),
    getValue(node.prefLabel),
    getAppellationValue(node),
    !node.id ? getValue(node._label) : undefined,
    typeLabels.length === 1 ? typeLabels[0] : undefined,
    node.id,
    node.type,
  );
}

function getAppellationValue(node: LinkedArtNode): string | undefined {
  return findByPath(node, ['is_appellative_subject_of'])
    .flatMap((status) => Object.entries(status)
      .filter(([key]) => key.endsWith('ascribes_appellation'))
      .flatMap(([, value]) => asArray(value)))
    .map((value) => isLinkedArtNode(value)
      ? getContent(value)
      : getValue(value))
    .find((value) => !!value);
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
