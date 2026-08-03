import { getConceptLabel, SkosConcept } from './SkosModel.ts';
import { ObjectCardAction } from '@globalise/design';

export type RelationKey =
  | 'broader'
  | 'narrower'
  | 'related'
  | 'hasTopConcept'
  | 'inScheme'
  | 'topConceptOf';

type ConceptNodeProps = {
  concept: SkosConcept;
  childKey?: RelationKey;
  onSelect: (concept: SkosConcept) => void;
};

export function ConceptNode({
  concept,
  childKey,
  onSelect,
}: ConceptNodeProps) {
  const children = childKey ? concept[childKey] : undefined;
  return (
    <li>
      <ObjectCardAction onClick={() => onSelect(concept)}>
        {getConceptLabel(concept)}
      </ObjectCardAction>
      {!!children?.length && (
        <ul className="concept-list">
          {children.map((child) => (
            <ConceptNode
              key={child.id}
              concept={child}
              childKey={childKey}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </li>
  );
}