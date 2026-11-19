import {
  highlightingFor,
  LanguageSupport,
  LRLanguage,
  syntaxTree,
} from '@codemirror/language';
import { Prec, RangeSetBuilder } from '@codemirror/state';
import {
  Decoration,
  EditorView,
  ViewPlugin,
  ViewUpdate,
} from '@codemirror/view';
import { styleTags, tags as t } from '@lezer/highlight';
import { parser } from './parser';
import type { DecorationSet } from '@codemirror/view';

const luceneParser = parser.configure({
  props: [
    styleTags({
      Term: t.string,
      Phrase: t.string,

      And: t.operatorKeyword,
      Or: t.operatorKeyword,
      Not: t.operatorKeyword,

      Integer: t.number,
      Float: t.number,

      'Proximity/"~"': t.modifier,
      'Fuzzy/"~"': t.modifier,
      'Boost/"^"': t.modifier,
      'PrefixWildcardTerm/"*"': t.modifier,

      Regex: t.regexp,
      '( )': t.paren,

      FunctionName: t.function(t.variableName),
      'FieldClause/Term': t.propertyName,
      ': ,': t.separator,
    }),
  ],
});

const luceneLanguage = LRLanguage.define({
  parser: luceneParser,
  languageData: {
    name: 'lucene',
  },
});

// Escapes are part of the Term, Phrase and Regex tokens, so they never become nodes in the syntax tree.
// Mark them separately, using whatever class the active highlighter assigns to the escape tag.
const escapeNodes = ['Term', 'Phrase', 'Regex'];
// Match any escaped code point, including newlines and astral characters such as emoji.
const escapeRegex = /\\[\s\S]/gu;

function createEscapeDecorations(view: EditorView): DecorationSet {
  const tree = syntaxTree(view.state);
  const className = highlightingFor(view.state, [t.escape], tree.type);
  if (!className) {return Decoration.none;}

  // Queries are short, so scan the whole tree rather than the visible ranges; this also guarantees
  // each node is visited once, as RangeSetBuilder requires sorted, non-repeating ranges.
  const mark = Decoration.mark({ class: className });
  const builder = new RangeSetBuilder<Decoration>();
  tree.iterate({
    enter: (node) => {
      if (!escapeNodes.includes(node.name)) {return;}

      const text = view.state.doc.sliceString(node.from, node.to);
      for (const match of text.matchAll(escapeRegex))
      {builder.add(
        node.from + match.index,
        node.from + match.index + match[0].length,
        mark,
      );}
    },
  });

  return builder.finish();
}

const escapePlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = createEscapeDecorations(view);
    }

    update(update: ViewUpdate) {
      if (
        update.docChanged ||
        syntaxTree(update.startState) !== syntaxTree(update.state) ||
        update.transactions.some((tr) => tr.reconfigured)
      )
      {this.decorations = createEscapeDecorations(update.view);}
    }
  },
  {
    decorations: (plugin) => plugin.decorations,
  },
);

export default function LuceneLanguageSupport() {
  // Higher precedence marks are drawn inside lower ones; this keeps the escape inside the highlighted token.
  return new LanguageSupport(luceneLanguage, [Prec.highest(escapePlugin)]);
}
