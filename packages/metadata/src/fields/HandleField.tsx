import {
  isClassifiedAs,
  findByPath,
  label as labelOf,
  url,
  useMetadataNodes,
} from '@globalise/common';
import { IconOpenInNew } from '@globalise/design';
import { Pair } from '../common';

const webPage = 'http://vocab.getty.edu/aat/300264578';

export function HandleField() {
  const label = 'Handle';
  const webPages = useMetadataNodes(['subject_of', 'digitally_carried_by'])
    .filter((object) => isClassifiedAs(object, webPage));
  const [object] = webPages;
  const href = object && url(findByPath(object, ['access_point'])[0]);
  if (!href) {
    return null;
  }
  return (
    <Pair label={label}>
      <a className="document-detail-overlay-link" href={href} target="_blank">
        {labelOf(object)}
        <IconOpenInNew className="document-detail-overlay-icon-small"/>
      </a>
    </Pair>
  );
}