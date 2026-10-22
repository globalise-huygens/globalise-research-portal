import {
  label as labelOf,
  findByPath,
  url as urlOf,
  useMetadataNodes,
} from '@globalise/common';
import { IconExternalLink } from '@globalise/design';
import { EmptyPair, Pair } from '../common';
import type { FieldProps } from './FieldProps';

export function DocumentPageField({
  url,
  label = 'Handle',
  fallback,
  path = ['subject_of'],
}: FieldProps) {
  const [object] = useMetadataNodes(url, path);
  const link = object && (findByPath(object, ['digitally_carried_by', 'access_point'])[0]
    ?? findByPath(object, ['access_point'])[0] ?? object);
  const href = link && urlOf(link);
  if (!object || !href || !/^https?:\/\//i.test(href)) {
    return <EmptyPair label={label} fallback={fallback}/>;
  }
  return (
    <Pair label={label}>
      <a
        className="metadata-link"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {labelOf(object)}
        <IconExternalLink className="icon" aria-hidden="true"/>
      </a>
    </Pair>
  );
}
