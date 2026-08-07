import { getConceptLabel, SkosConcept } from './SkosModel.ts';
import { IconArrowTopRight, ObjectCardAction } from '@globalise/design';

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
    <li className="concept-node">
      <ObjectCardAction
        className="concept-link"
        onPress={() => onSelect(concept)}
      >
        <span className="concept-label">
          {getConceptLabel(concept)}
        </span>
        {!!children?.length && (
          <strong className="concept-count">
            {children.length}
          </strong>
        )}
        <IconArrowTopRight
          aria-hidden="true"
          className="concept-link-icon"
        />
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
