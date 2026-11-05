import {
  ObjectCardProperty,
  ObjectCardPropertyList,
  ObjectCardSection,
} from '@globalise/design';
import { getContent, findByPath, LinkedArtNode } from '@globalise/common';
import { RelationLink } from './RelationLink.tsx';

type EntitySummaryProps = {
  entity: LinkedArtNode;
};

export function EntitySummary({ entity }: EntitySummaryProps) {
  const types = findByPath(entity, ['classified_as']);
  const identifiers = findByPath(entity, ['identified_by']);

  return (
    <ObjectCardSection title="Identity">
      <ObjectCardPropertyList>
        <ObjectCardProperty
          label="Type"
          value={types.length
            ? types.map((type, index) => <span key={type.id ?? index}>
              {index > 0 && ', '}<RelationLink node={type} />
            </span>)
            : entity.type}
        />
        {identifiers.map((identifier, i) => (
          <ObjectCardProperty
            key={i}
            label={getIdentifierLabel(identifier)}
            value={getContent(identifier)}
          />
        ))}
      </ObjectCardPropertyList>
    </ObjectCardSection>
  );
}

function getIdentifierLabel(identifier: LinkedArtNode): string {
  const [type] = findByPath(identifier, ['classified_as']);
  return type?.id ?? 'Identifier';
}
