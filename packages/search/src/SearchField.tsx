import { useRef, useState } from 'react';
import { Button } from 'react-aria-components';
import { useQueryClient } from '@tanstack/react-query';
import { getSVGElement } from '@globalise/common';
import {
  svgEntityPlace,
  svgEntityPerson,
  IconSearch,
  IconUndo,
  IconRedo,
  IconClose,
} from '@globalise/design';
import { useSearchFacet } from '@knaw-huc/faceted-search-react';
import { UpdateState, ThemeConfig, AutocompleteConfig } from '@knaw-huc/searchfield';
import { default as SF, SearchFieldRef } from '@knaw-huc/searchfield/react';
import autocompleteQueryOptions from './queries/autocompleteQueryOptions';
import classes from './SearchField.module.css';

import { type AutocompleteSuggestion } from './elasticsearch/autocomplete.server';

const types: Record<string, { color: string, icon: SVGElement }> = {
  'Place': { color: 'var(--entity-place)', icon: getSVGElement(svgEntityPlace) },
  'Polity': { color: 'var(--entity-actor)', icon: getSVGElement(svgEntityPerson) },
  'Person': { color: 'var(--entity-actor)', icon: getSVGElement(svgEntityPerson) },
};

export default function SearchField() {
  const queryClient = useQueryClient();
  const { query, onSearch } = useSearchFacet();
  const searchFieldRef = useRef<SearchFieldRef>(null);
  const [history, updateHistory] = useState<UpdateState>({ canUndo: false, canRedo: false });

  const darkTheme: ThemeConfig = {
    fontFamily: 'var(--font-sans)',
    fontFamilyAutocomplete: 'var(--font-sans)',
    entity: { style: { borderRadius: 0 } },
    icon: { className: classes.autocompleteIcon },
    highlight: {
      string: classes.searchText,
    },
  };

  const autocomplete: AutocompleteConfig<AutocompleteSuggestion> = {
    source: async (query) => queryClient.fetchQuery(autocompleteQueryOptions({ query })),
    minimumChars: 2,
    debounceMs: 300,
    id: 'id',
    type: 'type',
    label: 'label',
    description: (entity) => [
      entity.type,
      entity.alternatives.join(', '),
    ].filter(Boolean).join(' • '),
    icon: (sugg) => types[sugg.type]?.icon,
    token: {
      color: (token) => types[token.type]?.color,
      icon: (token) => types[token.type]?.icon,
    },
  };

  return (
    <div className={classes.searchField}>
      <div className={classes.input}>
        <SF className={classes.inputContainer} ref={searchFieldRef}
          query={query} onSearch={onSearch}
          onUpdate={({ canUndo, canRedo }) => updateHistory({ canUndo, canRedo })}
          theme={{ dark: darkTheme }} autocomplete={autocomplete}
          enableHistory enableLuceneQuerySyntax/>
      </div>

      <div className={classes.buttons}>
        <Button aria-label="Search" onClick={() => searchFieldRef.current?.search()}>
          <IconSearch aria-hidden="true"/>
        </Button>
        <Button aria-label="Undo search edit" onClick={() => searchFieldRef.current?.undo()}
          isDisabled={!history.canUndo}>
          <IconUndo aria-hidden="true"/>
        </Button>
        <Button aria-label="Redo search edit" onClick={() => searchFieldRef.current?.redo()}
          isDisabled={!history.canRedo}>
          <IconRedo aria-hidden="true"/>
        </Button>
        <Button aria-label="Clear search" onClick={() => searchFieldRef.current?.clear()}>
          <IconClose aria-hidden="true"/>
        </Button>
      </div>
    </div>
  );
}
