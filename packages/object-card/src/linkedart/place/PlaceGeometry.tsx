import {
  findByPath,
  getContent,
  label,
  type LinkedArtNode,
} from '@globalise/common';
import { ObjectCardProperty, ObjectCardPropertyList } from '@globalise/design';

type PlaceGeometryProps = {
  expressions: LinkedArtNode[];
};

export function PlaceGeometry({ expressions }: PlaceGeometryProps) {
  return <ObjectCardPropertyList className="person-status-details">
    {expressions.map((expression, index) => {
      const classificationLabels = findByPath(expression, ['classified_as'])
        .map(label)
        .filter(Boolean);
      const title = classificationLabels.join(', ') || 'Coordinates';
      return <ObjectCardProperty
        key={expression.id ?? index}
        label={title}
        value={getPlaceGeometryValue(expression)}
      />;
    })}
  </ObjectCardPropertyList>;
}

function getPlaceGeometryValue(expression: LinkedArtNode) {
  const content = getContent(expression);
  if (content) {
    return content;
  }
  if (typeof expression.as_wkt === 'string') {
    return expression.as_wkt;
  }
  return label(expression);
}
