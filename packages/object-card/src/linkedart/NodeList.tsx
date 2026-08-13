import { ObjectCardSection } from '@globalise/design';
import { LinkedArtNode } from '@globalise/common';
import { RelationLink } from './RelationLink.tsx';

type NodeListProps = {
  title: string;
  nodes: LinkedArtNode[];
};

export function NodeList({ title, nodes }: NodeListProps) {
  if (!nodes.length) {
    return null;
  }
  return (
    <ObjectCardSection title={title} scrollable>
      <ul className="node-list">
        {nodes.map((node, i) => <li key={i}><RelationLink node={node}/></li>)}
      </ul>
    </ObjectCardSection>
  );
}
