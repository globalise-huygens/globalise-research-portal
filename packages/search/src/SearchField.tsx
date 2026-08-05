import { useRef, useState } from 'react';
import { Button } from 'react-aria-components';
import { getSVGElement } from '@globalise/common';
import { svgEntityPlace, svgEntityPerson, IconSearch, IconClose } from '@globalise/design';
import { useSearchFacet } from '@knaw-huc/faceted-search-react';
import { UpdateState, ThemeConfig, AutocompleteConfig } from '@knaw-huc/searchfield';
import { default as SF, SearchFieldRef } from '@knaw-huc/searchfield/react';
import classes from './SearchField.module.css';

import IconUndo from './assets/undo.svg?react';
import IconRedo from './assets/redo.svg?react';
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
    entity: { className: classes.entity },
    // icon?: { className?: string, style?: StyleSpec };
    // cross?: { className?: string, style?: StyleSpec };
    // highlight: {
    //   string?: string;
    //   operatorKeyword?: string;
    //   number?: string;
    //   modifier?: string;
    //   regexp?: string;
    //   escape?: string;
    //   paren?: string;
    // };
  };

  const autocomplete: AutocompleteConfig<Entity> = {
    // TODO: To be replaced by an ElasticSearch autocomplete service
    // eslint-disable-next-line @typescript-eslint/require-await
    source: async (query: string) => {
      query = query.toLowerCase();
      return entities.filter((entity) => {
        const labelMatch = entity.label.toLowerCase().includes(query);
        const altMatch = entity.alternatives.find((alt) => alt.toLowerCase().includes(query));

        return labelMatch || altMatch;
      });
    },
    entityRegex: /({"id":.*?,"type":.*?,"label":.*?,"alternatives":.*?})/g,
    id: 'id',
    label: 'label',
    description: (entity) => entity.alternatives.join(', '),
    color: (entity) => types[entity.type].color,
    icon: (entity) => types[entity.type].icon,
  };

  return (
    <div className={classes.searchField}>
      <SF className={classes.inputContainer} ref={searchFieldRef}
        query={query} onSearch={onSearch}
        onUpdate={({ canUndo, canRedo }) => updateHistory({ canUndo, canRedo })}
        theme={{ dark: darkTheme }} autocomplete={autocomplete}
        enableHistory enableLuceneQuerySyntax/>

      <div className={classes.buttons}>
        <Button onClick={() => searchFieldRef.current?.search()}><IconSearch/></Button>
        <Button onClick={() => searchFieldRef.current?.undo()} isDisabled={!history.canUndo}><IconUndo/></Button>
        <Button onClick={() => searchFieldRef.current?.redo()} isDisabled={!history.canRedo}><IconRedo/></Button>
        <Button onClick={() => searchFieldRef.current?.clear()}><IconClose/></Button>
      </div>
    </div>
  );
}
