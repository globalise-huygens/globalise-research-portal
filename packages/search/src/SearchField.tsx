import { useEffect, useState, type RefObject } from 'react';
import { Button, Menu, MenuItem, MenuTrigger, Popover } from 'react-aria-components';
import { useQueryClient } from '@tanstack/react-query';
import { getPresentationFamily, getSVGElement } from '@globalise/common';
import {
  svgEntityPlace,
  svgEntityPerson,
  IconSearch,
  IconInfo,
  IconUndo,
  IconRedo,
  IconClose,
  ToolButton,
} from '@globalise/design';
import { useSearchFacet } from '@knaw-huc/faceted-search-react';
import { UpdateState, ThemeConfig, AutocompleteConfig } from '@knaw-huc/searchfield';
import { default as SF, SearchFieldRef } from '@knaw-huc/searchfield/react';
import autocompleteQueryOptions from './queries/autocompleteQueryOptions';
import classes from './SearchField.module.css';

import { type AutocompleteSuggestion } from './elasticsearch/autocomplete.server';

const icons: Record<string, string> = {
  Place: svgEntityPlace,
  Polity: svgEntityPerson,
  Person: svgEntityPerson,
};

export default function SearchField({
  editorRef,
  autoFocus = false,
  isMobile = false,
  queryHelpId,
  queryHelpOpen,
  onToggleQueryHelp,
}: {
  editorRef: RefObject<SearchFieldRef | null>;
  autoFocus?: boolean;
  isMobile?: boolean;
  queryHelpId: string;
  queryHelpOpen: boolean;
  onToggleQueryHelp: () => void;
}) {
  const queryClient = useQueryClient();
  const { query, onSearch } = useSearchFacet();
  const [history, updateHistory] = useState<UpdateState>({ canUndo: false, canRedo: false });
  const actions = [
    { id: 'search', label: 'Search', icon: IconSearch, disabled: false },
    { id: 'help', label: 'Search query help', icon: IconInfo, disabled: false },
    {
      id: 'undo', label: 'Undo search edit', icon: IconUndo,
      disabled: !history.canUndo,
    },
    {
      id: 'redo', label: 'Redo search edit', icon: IconRedo,
      disabled: !history.canRedo,
    },
    { id: 'clear', label: 'Clear search', icon: IconClose, disabled: false },
  ] as const;

  function runAction(action: (typeof actions)[number]['id']) {
    if (action === 'help') {
      onToggleQueryHelp();
      return;
    }
    editorRef.current?.[action]();
  }

  useEffect(() => {
    if (autoFocus) {
      // The editor mounts in its own effect. Focus after mounting and route
      // scroll restoration, without adding a second search implementation.
      const frame = requestAnimationFrame(() => editorRef.current?.focus());
      return () => cancelAnimationFrame(frame);
    }
  }, [autoFocus, editorRef]);

  const queryHelpButton = {
    className: classes.queryHelpToggle,
    'aria-label': 'Search query help',
    'aria-expanded': queryHelpOpen,
    'aria-controls': queryHelpId,
  };

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
    source: async (query) => queryClient.query(autocompleteQueryOptions({ query })),
    minimumChars: 2,
    debounceMs: 300,
    id: 'id',
    type: 'type',
    label: 'label',
    description: (entity) => [
      entity.type,
      entity.alternatives.join(', '),
    ].filter(Boolean).join(' • '),
    icon: (sugg) => toIcon(sugg.type),
    token: {
      color: (token) => {
        const family = getPresentationFamily(token.type);
        return family ? `var(--annotation-${family})` : undefined;
      },
      icon: (token) => toIcon(token.type),
    },
  };

  return (
    <div id="archive-search" className={classes.searchField}>
      <div className={classes.input}>
        <SF className={classes.inputContainer} ref={editorRef}
          query={query} onSearch={(query) => onSearch(query.source)}
          onUpdate={({ canUndo, canRedo }) => updateHistory({ canUndo, canRedo })}
          theme={{ dark: darkTheme }} autocomplete={autocomplete}
          enableHistory enableLuceneQuerySyntax/>
      </div>

      {isMobile ? (
        <div className={classes.mobileActions}>
          <ToolButton
            {...queryHelpButton}
            size="touch"
            icon={<IconInfo aria-hidden="true"/>}
            onPress={onToggleQueryHelp}
          />
          <MenuTrigger>
            <ToolButton size="touch" aria-label="Search actions"
              icon={<IconSearch aria-hidden="true" />}
            />
            <Popover placement="bottom end" className={classes.actionPopover}>
              <Menu className={classes.actionMenu}>
                {actions.filter(({ id }) => id !== 'help').map(({ id, label, icon: Icon, disabled }) => (
                  <MenuItem key={id} className={classes.actionItem}
                    isDisabled={disabled} onAction={() => runAction(id)}>
                    <Icon aria-hidden="true" />
                    {label}
                  </MenuItem>
                ))}
              </Menu>
            </Popover>
          </MenuTrigger>
        </div>
      ) : (
        <div className={classes.buttons}>
          {actions.map(({ id, label, icon: Icon, disabled }) => (
            <Button
              key={id}
              aria-label={label}
              {...(id === 'help' ? queryHelpButton : {})}
              onPress={() => runAction(id)}
              isDisabled={disabled}
            >
              <Icon aria-hidden="true" />
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

function toIcon(type: string): SVGElement | undefined {
  const svg = icons[type];
  return svg ? getSVGElement(svg) : undefined;
}
