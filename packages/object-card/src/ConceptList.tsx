import { ConceptNode, RelationKey } from './ConceptNode.tsx';
import { SkosConcept } from './SkosModel.ts';

type ConceptListProps = {
  title: string;
  concepts?: SkosConcept[];
  childKey?: RelationKey;
};

export function ConceptList({ title, concepts, childKey }: ConceptListProps) {
  if (!concepts?.length) {
    return <h2 title="No data" className="inactive">{title}</h2>;
  }
  return (
    <>
      <h2>{title}</h2>
      <ul className="concept-list">
        {concepts.map((concept) => (
          <ConceptNode key={concept.id} concept={concept} childKey={childKey} />
        ))}
      </ul>
    </>
  );
}