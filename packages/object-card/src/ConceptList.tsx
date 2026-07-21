import { loadConcept } from './ConceptSlice.ts';
import { conceptLabel, ConceptRef } from './ObjectCardModel.ts';

type ConceptListProps = { title: string; concepts?: ConceptRef[] };

export function ConceptList({ title, concepts }: ConceptListProps) {
  if (!concepts?.length) {
    return <h2 title="No data" className="inactive">{title}</h2>;
  }
  return (
    <>
      <h2>{title}</h2>
      <ul className="concept-list">
        {concepts.map((concept) => (
          <li key={concept.id}>
            <button onClick={() => void loadConcept(concept.id)}>
              {conceptLabel(concept)}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}