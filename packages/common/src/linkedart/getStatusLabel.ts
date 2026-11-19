import { LinkedArtNode } from './LinkedArtNode.ts';
import { getContent } from './getContent.ts';
import { label } from './label.ts';
import { getStatusValues, StatusValue } from './getStatusValues.ts';

export function getStatusLabel(status: LinkedArtNode): string {
  const ascribed = getAscribedValues(status)
    .map(getValueLabel)
    .filter((found) => !!found);
  if (!ascribed.length) {
    return label(status);
  }
  return ascribed.join(', ');
}

function getAscribedValues(status: LinkedArtNode): StatusValue[] {
  return Object.keys(status)
    .filter((key) => key.startsWith('ascribes_') && !key.endsWith('_relation'))
    .flatMap((key) => getStatusValues(status, [key]));
}

function getValueLabel(value: StatusValue): string {
  return typeof value === 'string' ? value : getContent(value) || label(value);
}
