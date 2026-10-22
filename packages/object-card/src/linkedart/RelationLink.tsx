import {
  ObjectCardAction,
  ObjectCardExternalLink,
} from '@globalise/design';
import { getContent, label, LinkedArtNode, url } from '@globalise/common';
import { useNavigate } from '@globalise/router';
import { isInternalUri } from '../isInternalUri.ts';

type RelationLinkProps = {
  node: LinkedArtNode;
};

export function RelationLink({ node }: RelationLinkProps) {
  const navigate = useNavigate();
  const href = url(node);
  const text = getFirstValue(label(node), getContent(node), node.id, node.type);

  if (href && isInternalUri(href)) {
    return (
      <ObjectCardAction onClick={() => void navigate({ to: '/object-card', search: { uri: href } })}>
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
