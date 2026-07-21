import {
  isClassifiedAs,
  findByPath,
  label as labelOf,
  url as urlOf,
  useMetadataNodes,
} from '@globalise/common';
import { IconExternalLink } from '@globalise/design';
import { EmptyPair, Pair } from '../common';
import type { FieldProps } from './FieldProps';

const webPage = 'http://vocab.getty.edu/aat/300264578';

export function HandleField({ url, label = 'Handle', fallback }: FieldProps) {
  const webPages = useMetadataNodes(url, ['subject_of', 'digitally_carried_by'])
    .filter((object) => isClassifiedAs(object, webPage));
  const [object] = webPages;
  const href = object && urlOf(findByPath(object, ['access_point'])[0]);
  if (!href) {
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
        <IconExternalLink className="icon"/>
      </a>
    </Pair>
  );
}
