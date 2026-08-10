import {
  ObjectCardAction,
  ObjectCardExternalLink,
} from '@globalise/design';
import { getContent, label, LinkedArtNode, url } from '@globalise/common';
import { isInternalUri, loadResource } from '../resolve';

type RelationLinkProps = {
  node: LinkedArtNode;
};

export function RelationLink({ node }: RelationLinkProps) {
  const href = url(node);
  const text = getFirstValue(label(node), getContent(node), node.id, node.type);

  if (href && isInternalUri(href)) {
    return (
      <ObjectCardAction onClick={() => void loadResource(href)}>
        {text}
      </ObjectCardAction>
    );
  }
  if (href) {
    return (
      <ObjectCardExternalLink href={href}>{text}</ObjectCardExternalLink>
    );
  }
  return <span className="relation">{text}</span>;
}

function getFirstValue(...values: (string | undefined)[]): string {
  return values.find((value) => !!value) ?? '';
}
