import {
  history,
  undo,
  redo,
  undoDepth,
  redoDepth,
  standardKeymap,
  historyKeymap,
} from '@codemirror/commands';
import { EditorState, Compartment } from '@codemirror/state';
import { autocompletion } from '@codemirror/autocomplete';
import { EditorView, ViewUpdate, keymap } from '@codemirror/view';
import {
  defaultHighlightStyle,
  syntaxHighlighting,
  bracketMatching,
  syntaxTree,
  HighlightStyle,
} from '@codemirror/language';
import { oneDarkHighlightStyle } from '@codemirror/theme-one-dark';
import { tags as t } from '@lezer/highlight';
import getQuery from './getQuery';
import createEntitiesPlugin from './createEntitiesPlugin';
import createEntityCompletionSource from './createEntityCompletionSource';
import LuceneLanguageSupport from './lucene/LuceneLanguageSupport';

import { type Extension } from '@codemirror/state';
import {
  type HighlightConfig,
  type Query,
  type ThemeConfig,
} from './SearchFieldConfig';
import type SearchFieldConfig from './SearchFieldConfig';

export default class SearchField<E extends object = object> {
  private readonly config: SearchFieldConfig<E>;
  private readonly view: EditorView;

  constructor(parent: Element, config: Partial<SearchFieldConfig<E>> = {}) {
    this.config = {
      query: '',
      enableHistory: false,
      enableLuceneQuerySyntax: false,
      defaultOperator: 'and',
      ...config,
    };

    const state = EditorState.create({
      doc: this.config.query,
      extensions: this.createExtensions(),
    });

    this.view = new EditorView({ parent, state });
  }

  public search() {
    this.config.onSearch?.(this.getQuery());
  }

  public undo() {
    if (this.config.enableHistory) {
      undo(this.view);
    }
  }

  public redo() {
    if (this.config.enableHistory) {
      redo(this.view);
    }
  }

  public clear() {
    this.view.dispatch({
      changes: { from: 0, to: this.view.state.doc.length, insert: '' },
    });
  }

  public focus() {
    this.view.focus();
  }

  public destroy() {
    this.view.destroy();
  }

  private onUpdate(update: ViewUpdate) {
    if (
      !update.docChanged &&
      !update.transactions.some((tr) => tr.effects.length)
    )
    {return;}

    if (this.config.onUpdate) {
      const canUndo = undoDepth(update.state) > 0;
      const canRedo = redoDepth(update.state) > 0;

      this.config.onUpdate({ canUndo, canRedo });
    }
  }

  private getQuery(): Query {
    const doc = this.view.state.doc.toString();
    return getQuery(
      doc,
      syntaxTree(this.view.state),
      this.config.defaultOperator,
    );
  }

  private createExtensions(): Extension[] {
    const themeCompartment = new Compartment();
    const syntaxHighlightingCompartment = new Compartment();
    const hasBothThemes = this.config.theme?.dark && this.config.theme?.light;
    const hasBothHighlightThemes =
      this.config.theme?.dark?.highlight && this.config.theme?.light?.highlight;
    const prefersDarkMedia = window.matchMedia('(prefers-color-scheme: dark)');

    const theme = hasBothThemes
      ? themeCompartment.of(
        this.createTheme(
          prefersDarkMedia.matches,
          prefersDarkMedia.matches
            ? this.config.theme?.dark
            : this.config.theme?.light,
        ),
      )
      : this.config.theme?.dark
        ? this.createTheme(true, this.config.theme?.dark)
        : this.createTheme(false, this.config.theme?.light);

    const syntaxHighlightingExt = hasBothHighlightThemes
      ? syntaxHighlightingCompartment.of(
        this.createSyntaxHighlighting(
          prefersDarkMedia.matches,
          prefersDarkMedia.matches
            ? this.config.theme?.dark?.highlight
            : this.config.theme?.light?.highlight,
        ),
      )
      : this.config.theme?.dark
        ? this.createSyntaxHighlighting(
          true,
          this.config.theme?.dark?.highlight,
        )
        : this.createSyntaxHighlighting(
          false,
          this.config.theme?.light?.highlight,
        );

    if (hasBothThemes || hasBothHighlightThemes) {
      prefersDarkMedia.addEventListener('change', (e) => {
        if (hasBothThemes) {
          this.view.dispatch({
            effects: themeCompartment.reconfigure(
              this.createTheme(
                e.matches,
                e.matches ? this.config.theme?.dark : this.config.theme?.light,
              ),
            ),
          });
        }
        if (hasBothHighlightThemes) {
          this.view.dispatch({
            effects: syntaxHighlightingCompartment.reconfigure(
              this.createSyntaxHighlighting(
                e.matches,
                e.matches
                  ? this.config.theme?.dark?.highlight
                  : this.config.theme?.light?.highlight,
              ),
            ),
          });
        }
      });
    }

    return [
      theme,
      EditorView.lineWrapping,
      EditorView.updateListener.of(this.onUpdate.bind(this)),
      this.createKeymap(),
      this.config.enableHistory ? [history()] : [],
      this.config.autocomplete
        ? [
          this.createAutocompletion(),
          createEntitiesPlugin(this.config.autocomplete, {
            entity:
                this.config.theme?.light?.entity?.className ??
                this.config.theme?.dark?.entity?.className,
            entityIcon:
                this.config.theme?.light?.icon?.className ??
                this.config.theme?.dark?.icon?.className,
            entityCross:
                this.config.theme?.light?.cross?.className ??
                this.config.theme?.dark?.cross?.className,
          }),
        ]
        : [],
      this.config.enableLuceneQuerySyntax
        ? [bracketMatching(), LuceneLanguageSupport(), syntaxHighlightingExt]
        : [],
    ];
  }

  private createTheme(dark: boolean, config?: ThemeConfig): Extension {
    return EditorView.theme(
      {
        '.cm-content': {
          padding: '0',
          fontFamily: config?.fontFamily ?? 'sans-serif',
        },
        '.cm-line': {
          padding: '0',
        },
        '&.cm-focused': {
          outline: 'none',
        },
        '.cm-entity': {
          display: 'inline-flex',
          alignItems: 'center',
          padding: '0.2em',
          borderRadius: '0.2em',
          fontSize: '0.9em',
          backgroundColor: 'var(--cm-entity-color)',
          color: 'color-mix(in srgb, var(--cm-entity-color) 10%, black 90%);',
          ...config?.entity?.style,
        },
        '.cm-entity-icon': {
          marginRight: '0.2em',
          width: '1em',
          height: '1em',
          ...config?.icon?.style,
        },
        '.cm-entity-cross': {
          cursor: 'pointer',
          marginLeft: '0.2em',
          alignSelf: 'baseline',
          ...config?.cross?.style,
        },
        '.cm-tooltip.cm-tooltip-autocomplete': {
          '& > ul': {
            fontFamily: config?.fontFamilyAutocomplete ?? 'sans-serif',
          },
        },
        '.cm-completionDetail': {
          display: 'block',
          fontSize: '0.9em',
          margin: '0',
        },
      },
      { dark },
    );
  }

  private createSyntaxHighlighting(
    dark: boolean,
    config?: HighlightConfig,
  ): Extension {
    return [
      ...(config
        ? [
          syntaxHighlighting(
            HighlightStyle.define(
              [
                { tag: t.string, class: config?.string },
                { tag: t.operatorKeyword, class: config?.operatorKeyword },
                { tag: t.number, class: config?.number },
                { tag: t.modifier, class: config?.modifier },
                { tag: t.regexp, class: config?.regexp },
                { tag: t.escape, class: config?.escape },
                { tag: t.paren, class: config?.paren },
                { tag: t.function(t.variableName), class: config?.function },
                { tag: t.propertyName, class: config?.field },
                { tag: t.separator, class: config?.separator },
              ],
              { themeType: dark ? 'dark' : 'light' },
            ),
          ),
        ]
        : []),
      dark
        ? syntaxHighlighting(oneDarkHighlightStyle)
        : syntaxHighlighting(defaultHighlightStyle),
    ];
  }

  private createKeymap(): Extension {
    return keymap.of([
      {
        key: 'Enter',
        run: () => {
          if (this.config.onSearch) {this.config.onSearch(this.getQuery());}
          return true;
        },
      },
      ...standardKeymap,
      ...(this.config.enableHistory ? historyKeymap : []),
    ]);
  }

  private createAutocompletion(): Extension {
    return autocompletion({
      icons: false,
      override: [createEntityCompletionSource(this.config.autocomplete!)],
      addToOptions: this.config.autocomplete!.icon
        ? [
          {
            render: (completion) => {
              if ('entity' in completion) {
                const iconFromConfig = this.config.autocomplete!.icon!(
                  completion.entity as E,
                );
                if (iconFromConfig) {
                  const icon = iconFromConfig.cloneNode(true) as SVGElement;
                  icon.classList =
                    `cm-entity-icon ${this.config.theme?.light?.icon?.className} ${this.config.theme?.dark?.icon?.className}`.trim();
                  return icon;
                }
              }
              return null;
            },
            position: 5,
          },
        ]
        : undefined,
    });
  }
}
