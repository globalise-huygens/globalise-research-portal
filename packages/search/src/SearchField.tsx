import { useRef, useState } from 'react';
import { Button } from 'react-aria-components';
import { useSearchFacet } from '@knaw-huc/faceted-search-react';
import { UpdateState, ThemeConfig, AutocompleteConfig } from '@knaw-huc/searchfield';
import { default as SF, SearchFieldRef } from '@knaw-huc/searchfield/react';
import classes from './SearchField.module.css';

import { entities, Entity } from './mock/AutocompleteEntities';
import placeIcon from './assets/place.svg?raw';
import polityIcon from './assets/polity.svg?raw';

function getSVGElement(svg: string) {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svg, 'image/svg+xml');
  return svgDoc.documentElement as unknown as SVGElement;
}

const types = {
  'Place': { color: '#C5D89D', icon: getSVGElement(placeIcon) },
  'Polity': { color: '#BDE8F5', icon: getSVGElement(polityIcon) },
};

export default function SearchField() {
  const { query, onSearch } = useSearchFacet();
  const searchFieldRef = useRef<SearchFieldRef>(null);
  const [history, updateHistory] = useState<UpdateState>({ canUndo: false, canRedo: false });

  const darkTheme: ThemeConfig = {
    // fontFamily: 'sans-serif',
    // fontFamilyAutocomplete: 'sans-serif',
    // entity?: StyleSpec;
    // icon?: StyleSpec;
    // cross?: StyleSpec;
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

      <Button onClick={() => searchFieldRef.current?.search()}>🔎</Button>
      <Button onClick={() => searchFieldRef.current?.undo()} isDisabled={!history.canUndo}>↶</Button>
      <Button onClick={() => searchFieldRef.current?.redo()} isDisabled={!history.canRedo}>↷</Button>
      <Button onClick={() => searchFieldRef.current?.clear()}>&#10005;</Button>
    </div>
  );
}
