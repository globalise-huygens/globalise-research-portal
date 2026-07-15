import { useMetadataValues } from '@globalise/common';
import { Joined, Pair } from '../common';

export function TitlesField() {
  const label = 'Titles(s)';
  const titles = useMetadataValues(['title', 'content']);
  if (!titles.length) {
    return null;
  }
  return (
    <Pair label={label}>
      <Joined>
        {titles}
      </Joined>
    </Pair>
  );
}
