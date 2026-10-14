import { getValue } from '@iiif/helpers';
import type { MetadataItem } from '@iiif/presentation-3';

export function findMetadataValue(
  metadata: MetadataItem[],
  englishLabel: string,
): string | undefined {
  const item = metadata.find(
    (item) => getValue(item.label, { language: 'en' }) === englishLabel,
  );
  return item && getValue(item.value);
}
