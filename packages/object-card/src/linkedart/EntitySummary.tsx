import {
  ObjectCardProperty,
  ObjectCardPropertyList,
  ObjectCardSection,
} from '@globalise/design';
import { getContent, findByPath, label, LinkedArtNode } from '@globalise/common';

type EntitySummaryProps = {
  entity: LinkedArtNode;
};

export function EntitySummary({ entity }: EntitySummaryProps) {
  const types = findByPath(entity, ['classified_as'])
    .map(label)
    .filter((found) => !!found);
  const identifiers = findByPath(entity, ['identified_by']);

  return (
    <ObjectCardSection title="Identity">
      <ObjectCardPropertyList>
        <ObjectCardProperty
          label="Type"
          value={types.join(', ') || entity.type}
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
  return (type && label(type)) || 'Identifier';
}
