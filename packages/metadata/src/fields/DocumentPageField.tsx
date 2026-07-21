import {
  label as labelOf,
  useMetadataNodes,
} from '@globalise/common';
import { IconExternalLink } from '@globalise/design';
import { EmptyPair, Pair } from '../common';
import type { FieldProps } from './FieldProps';

export function DocumentPageField({ url, label = 'Document', fallback }: FieldProps) {
  const [object] = useMetadataNodes(url, ['subject_of']);
  // TODO: const href = object && urlOf(object)
  if (!url || !object) {
    return <EmptyPair label={label} fallback={fallback}/>;
  }
  return (
    <Pair label={label}>
      <a
        className="document-detail-overlay-link"
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {labelOf(object)}
        <IconExternalLink className="document-detail-overlay-icon-small"/>
      </a>
    </Pair>
  );
}