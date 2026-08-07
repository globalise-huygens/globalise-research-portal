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
    return null;
  }

  return (
    <section className="relation">
      <header className="relation-header">
        <h4>{title}</h4>
        <strong>{concepts.length}</strong>
      </header>
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
    </section>
  );
}
