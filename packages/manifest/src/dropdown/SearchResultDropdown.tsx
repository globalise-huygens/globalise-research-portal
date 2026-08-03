import {
  getSearchResultId,
  type SearchResult,
  toggleClicked,
  useDocumentStore,
  useSearchResults, isFullTextSearchBody,
} from '@globalise/common/document';
import { useScrollToFacsimileCanvas } from '../layout';
import { Dropdown } from './Dropdown.tsx';
import { canvasName } from '@globalise/common/annotation';

export function SearchResultDropdown() {
  const results = useSearchResults();
  const goToCanvas = useScrollToFacsimileCanvas();
  const selectedId = useDocumentStore((s) => s.clickedId);

  if (!results.length) {
    return null;
  }

  function select(result: SearchResult) {
    goToCanvas(result.canvasId);
    toggleClicked(getSearchResultId(result));
  }

  return (
    <Dropdown
      items={results}
      getKey={getSearchResultId}
      getLabel={toLabel}
      selectedKey={selectedId}
      emptyLabel={`${results.length} search results`}
      placeholder="Search results..."
      onSelect={select}
    />
  );
}

function toLabel(result: SearchResult): string {
  if(!isFullTextSearchBody(result.body)) {
    return JSON.stringify(result.body);
  }
  const { snippet, term } = result.body;
  return `${canvasName(result.canvasId)}: (${term}) ${snippet}`;
}