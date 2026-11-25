import {
  clearSearchHits,
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
    <>
      <span
        aria-hidden="true"
        className="top-bar-divider vertical"
      />
      <div className="bar-group search-hit-navigation">
        <PrevNextInputBrowser
          label="Search hits"
          name="search hit"
          index={activeHitIndex}
          total={hitCount}
          onSelect={selectSearchHit}
          onClose={clearSearchHits}
        />
      </div>
    </>
  );
}
