import { getValue } from '@iiif/helpers';
import type { MetadataItem } from '@iiif/parser/presentation-3/types';

export function findMetadataValue(
  metadata: MetadataItem[],
  ...labels: string[]
): string | undefined {
  const item = metadata.find((item) =>
    labels.some((label) => Object.values(item.label).flat().includes(label)),
  );
  return item && getValue(item.value);
}
