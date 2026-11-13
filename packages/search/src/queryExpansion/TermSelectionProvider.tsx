import { createContext, useCallback, useMemo, useState, useContext, type ReactNode } from 'react';
import getQueryExpansionQueryOptions, { QueryExpansion } from './getQueryExpansionQueryOptions';
import { useSearchFacet } from '@knaw-huc/faceted-search-react';
import { useQuery } from '@tanstack/react-query';

type Selected = 'all' | 'some' | 'none';
type Selection = Record<string, Record<string, Set<string>>>;

type TermSelection = {
  queryExpansion: QueryExpansion | undefined;
  isSelected: (term: string, sourceId: string, expansion: string) => boolean;
  sourceIsSelected: (term: string, sourceId: string) => Selected;
  termIsSelected: (term: string) => Selected;
  toggle: (term: string, sourceId: string, expansion: string) => void;
  toggleSource: (term: string, sourceId: string) => void;
  toggleTerm: (term: string) => void;
  selectedExpansions: Record<string, string[]> | undefined;
};

function createSelectedTerms(queryExpansion: QueryExpansion, prevSelection?: Selection) {
  return Object.keys(queryExpansion.terms).reduce<Selection>((selection, term) => {
    selection[term] = queryExpansion.terms[term].reduce<Record<string, Set<string>>>((acc, source) => {
      acc[source.source_id] = new Set(prevSelection ? prevSelection[term][source.source_id].values() : source.expansions);
      return acc;
    }, {});
    return selection;
  }, {});
}

const findExpansions = (queryExpansion: QueryExpansion, term: string, sourceId: string) =>
  queryExpansion.terms[term].find((source) => source.source_id === sourceId)?.expansions ?? [];

const SelectionContext = createContext<TermSelection | null>(null);

export function TermSelectionProvider({ children }: { children: ReactNode }) {
  const { query } = useSearchFacet();
  const { data: queryExpansion } = useQuery(getQueryExpansionQueryOptions(query ?? ''));
  const [selectedFor, setSelectedFor] = useState<QueryExpansion | undefined>(undefined);
  const [selectedTerms, setSelectedTerms] = useState<Selection>({});

  // Reset the selection while rendering when the expansions change,
  // so no child ever renders with the selection of a previous query
  if (queryExpansion !== selectedFor) {
    setSelectedFor(queryExpansion);
    setSelectedTerms(queryExpansion ? createSelectedTerms(queryExpansion) : {});
  }

  const isSelected = useCallback((term: string, sourceId: string, expansion: string) =>
    selectedTerms[term][sourceId].has(expansion), [selectedTerms]);

  const sourceIsSelected = useCallback((term: string, sourceId: string) => {
    const selectedSize = selectedTerms[term][sourceId].size;
    if (selectedSize === 0 || !queryExpansion) {
      return 'none';
    }

    const size = findExpansions(queryExpansion, term, sourceId).length;
    if (selectedSize === size) {
      return 'all';
    }

    return 'some';
  }, [selectedTerms, queryExpansion]);

  const termIsSelected = useCallback((term: string) => {
    const selectedSize = Object.values(selectedTerms[term])
      .map((values) => values.size)
      .reduce((a, b) => a + b);
    if (selectedSize === 0 || !queryExpansion) {
      return 'none';
    }

    const size = queryExpansion.terms[term]
      .map((source) => source.expansions.length)
      .reduce((a, b) => a + b);
    if (selectedSize === size) {
      return 'all';
    }

    return 'some';
  }, [selectedTerms, queryExpansion]);

  // Undefined as long as the expansions of the current query are not loaded yet
  const selectedExpansions = useMemo(() => {
    if (!queryExpansion || queryExpansion !== selectedFor) {
      return undefined;
    }

    return Object.fromEntries(Object.entries(selectedTerms).map(([term, expansions]) => {
      const flatExpansions = Object.values(expansions).flatMap((source) => [...source]);
      const uniqueExpansions = new Set(flatExpansions);
      return [term, [...uniqueExpansions].sort()];
    }));
  }, [queryExpansion, selectedFor, selectedTerms]);

  const toggle = useCallback((term: string, sourceId: string, expansion: string) =>
    setSelectedTerms((selectedTerms) => {
      if (!queryExpansion) {
        return selectedTerms;
      }

      const newSelection = createSelectedTerms(queryExpansion, selectedTerms);
      const selectedExpansions = newSelection[term][sourceId];
      if (selectedExpansions.has(expansion)) {
        selectedExpansions.delete(expansion);
      } else {
        selectedExpansions.add(expansion);
      }
      return newSelection;
    }), [queryExpansion, setSelectedTerms]);

  const toggleSource = useCallback((term: string, sourceId: string) =>
    setSelectedTerms((selectedTerms) => {
      if (!queryExpansion) {
        return selectedTerms;
      }

      const newSelection = createSelectedTerms(queryExpansion, selectedTerms);
      const allExpansions = findExpansions(queryExpansion, term, sourceId);
      if (newSelection[term][sourceId].size === allExpansions.length) {
        newSelection[term][sourceId] = new Set();
      } else {
        newSelection[term][sourceId] = new Set(allExpansions);
      }
      return newSelection;
    }), [queryExpansion, setSelectedTerms]);

  const toggleTerm = useCallback((term: string) =>
    setSelectedTerms((selectedTerms) => {
      if (!queryExpansion) {
        return selectedTerms;
      }

      const newSelection = createSelectedTerms(queryExpansion, selectedTerms);

      let allSelected = true;
      for (const [sourceId, sourceSelection] of Object.entries(newSelection[term])) {
        if (sourceSelection.size !== queryExpansion.terms[term].find((source) => source.source_id === sourceId)?.expansions.length) {
          allSelected = false;
          break;
        }
      }

      for (const sourceId of Object.keys(newSelection[term])) {
        if (allSelected) {
          newSelection[term][sourceId] = new Set();
        } else {
          newSelection[term][sourceId] = new Set(findExpansions(queryExpansion, term, sourceId));
        }
      }

      return newSelection;
    }), [queryExpansion, setSelectedTerms]);

  const termSelection = useMemo(() => ({
    queryExpansion, isSelected, sourceIsSelected, termIsSelected, toggle, toggleSource, toggleTerm, selectedExpansions,
  }), [queryExpansion, isSelected, sourceIsSelected, termIsSelected, toggle, toggleSource, toggleTerm, selectedExpansions]);

  return (
    <SelectionContext.Provider value={termSelection}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useTermSelection() {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error('Missing SelectionContext context');
  }

  return context;
}
