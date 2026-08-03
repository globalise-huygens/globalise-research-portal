import { ObjectCardSection } from '@globalise/design';
import { ConceptNode, RelationKey } from './ConceptNode.tsx';
import { SkosConcept } from './SkosModel.ts';

type ConceptListProps = {
  title: string;
  concepts?: SkosConcept[];
  childKey?: RelationKey;
  onSelect: (concept: SkosConcept) => void;
};

export function ConceptList({
  title,
  concepts,
  childKey,
  onSelect,
}: ConceptListProps) {
  if (!concepts?.length) {
    return <ObjectCardSection title={title} className="inactive"/>;
  }
  return (
    <ObjectCardSection title={title}>
      <ul className="concept-list">
        {concepts.map((concept) => (
          <ConceptNode
            key={concept.id}
            concept={concept}
            childKey={childKey}
            onSelect={onSelect}
          />
        ))}
      </ul>
    </ObjectCardSection>
  );
}