import { loadConcept } from './ConceptSlice.ts';
import { getConceptLabel, SkosConcept } from './SkosModel.ts';

export type RelationKey =
  | 'broader'
  | 'narrower'
  | 'related'
  | 'hasTopConcept'
  | 'inScheme'
  | 'topConceptOf';

type ConceptNodeProps = { concept: SkosConcept; childKey?: RelationKey };

export function ConceptNode({ concept, childKey }: ConceptNodeProps) {
  const children = childKey ? concept[childKey] : undefined;
  return (
    <li>
      <button onClick={() => void loadConcept(concept.id)}>
        {getConceptLabel(concept)}
      </button>
      {!!children?.length && (
        <ul className="concept-list">
          {children.map((child) => (
            <ConceptNode key={child.id} concept={child} childKey={childKey} />
          ))}
        </ul>
      )}
    </li>
  );
}