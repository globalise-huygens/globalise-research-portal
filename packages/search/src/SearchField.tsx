import { useRef, useState } from 'react';
import { Button } from 'react-aria-components';
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
import classes from './SearchField.module.css';

import { entities, Entity } from './mock/AutocompleteEntities';

const types = {
  'Place': { color: 'var(--entity-place)', icon: getSVGElement(svgEntityPlace) },
  'Polity': { color: 'var(--entity-actor)', icon: getSVGElement(svgEntityPerson) },
};

export default function SearchField() {
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

  const autocomplete: AutocompleteConfig<Entity> = {
    // TODO: To be replaced by an ElasticSearch autocomplete service
    // eslint-disable-next-line @typescript-eslint/require-await
    source: async (query: string) => {
      const normalizedQuery = query.toLowerCase();
      return entities.filter((entity) => {
        const labelMatch = entity.label.toLowerCase().includes(normalizedQuery);
        const alternativeMatch = entity.alternatives.some((alt) =>
          alt.toLowerCase().includes(normalizedQuery));

        return labelMatch || alternativeMatch;
      });
    },
    entityRegex: /({"id":.*?,"type":.*?,"label":.*?,"alternatives":.*?})/g,
    id: 'id',
    label: 'label',
    description: (entity) => [
      entity.type,
      entity.alternatives.join(', '),
    ].filter(Boolean).join(' • '),
    color: (entity) => types[entity.type].color,
    icon: (entity) => types[entity.type].icon,
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
