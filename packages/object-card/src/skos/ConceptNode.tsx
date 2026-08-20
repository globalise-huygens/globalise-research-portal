import { IconArrowTopRight, ObjectCardAction } from '@globalise/design';
import { getConceptLabel, type SkosConcept } from './SkosModel.ts';

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

export function ConceptNode({ concept, childKey, onSelect }: ConceptNodeProps) {
  const children = childKey ? concept[childKey] : undefined;
  return (
    <li className="concept-node">
      <ConceptNodeRow concept={concept} onSelect={onSelect} />
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

type ConceptNodeRowProps = {
  concept: SkosConcept;
  isCurrent?: boolean;
  isScheme?: boolean;
  isTopConcept?: boolean;
  onSelect: (concept: SkosConcept) => void;
};

export function ConceptNodeRow({
  concept,
  isCurrent,
  isScheme,
  isTopConcept,
  onSelect,
}: ConceptNodeRowProps) {
  const content = (
    <>
      <span className="concept-label">
        {getConceptLabel(concept)}
        {isScheme && (
          <span className="concept-position-label"> (Scheme)</span>
        )}
        {isTopConcept && (
          <span className="concept-position-label"> (Top concept)</span>
        )}
        {isCurrent && (
          <span className="concept-position-label"> (Current)</span>
        )}
      </span>
      {!isCurrent && (
        <IconArrowTopRight aria-hidden="true" className="concept-link-icon" />
      )}
    </>
  );

  if (isCurrent) {
    return (
      <div aria-current="page" className="concept-link current-concept">
        <span>{content}</span>
      </div>
    );
  }

  return (
    <ObjectCardAction
      className="concept-link"
      onPress={() => onSelect(concept)}
    >
      {content}
    </ObjectCardAction>
  );
}
