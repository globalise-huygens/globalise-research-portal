import {
  selectSearchHit,
  useActiveHitIndex,
  useSearchHitCount,
} from '@globalise/common/document';
import { PrevNextInputBrowser } from './PrevNextInputBrowser.tsx';

export function NavigateSearchHits() {
  const activeHitIndex = useActiveHitIndex();
  const hitCount = useSearchHitCount();

  if (activeHitIndex === null) {
    return null;
  }

  return (
    <div className="bar-group">
      <PrevNextInputBrowser
        label="search hits"
        name="search hit"
        index={activeHitIndex}
        total={hitCount}
        onSelect={selectSearchHit}
      />
    </div>
  );
}
