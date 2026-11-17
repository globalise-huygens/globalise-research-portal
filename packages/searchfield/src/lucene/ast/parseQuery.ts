import { entityTokenExactRegex } from '../../entityToken';
import type { SyntaxNode, Tree } from '@lezer/common';
import type {
  ASTBase,
  TreeQuery,
  BooleanQuery,
  NotQuery,
  TermQuery,
  PhraseQuery,
  RegexQuery,
  PrefixWildcardQuery,
  FuzzyQuery,
  EntityQuery,
  FieldQuery,
  ContainmentQuery,
  NearQuery,
} from './types';

const unescape = (value: string) => value.replace(/\\([\s\S])/g, '$1');

export default function parseQuery(
  source: string,
  tree: Tree,
  defaultOperator: 'and' | 'or',
): TreeQuery | null {
  const expressions = childrenNamed(tree.topNode, 'Expression')
    .map((node) => expression(node, source, defaultOperator))
    .filter((x): x is TreeQuery => x !== null);

  return expressions.length > 0
    ? expressions.length === 1
      ? expressions[0]
      : group(expressions, source, defaultOperator)
    : null;
}

function expression(
  node: SyntaxNode,
  source: string,
  defaultOperator: 'and' | 'or',
): TreeQuery | null {
  const children = namedChildren(node);

  const operator = children.find((child) =>
    ['And', 'Or', 'Not'].includes(child.name),
  );
  if (!operator) {
    const clause = children.find((child) => child.name === 'Clause');
    return clause ? clauseNode(clause, source, defaultOperator) : null;
  }

  if (operator.name === 'Not') {
    const operand = children.find((child) => child.name === 'Expression');
    if (!operand) {return null;}

    const clause = expression(operand, source, defaultOperator);
    if (!clause) {return null;}

    return withBase(
      { type: 'not', clause } satisfies Omit<NotQuery, keyof ASTBase>,
      node,
      source,
    );
  }

  const operands = children.filter((child) => child.name === 'Expression');
  if (operands.length !== 2) {return null;}

  const left = expression(operands[0], source, defaultOperator);
  const right = expression(operands[1], source, defaultOperator);
  if (!left || !right) {return null;}

  const type = operator.name === 'And' ? 'and' : 'or';
  return withBase(
    { type, clauses: [left, right] } satisfies Omit<
      BooleanQuery,
      keyof ASTBase
    >,
    node,
    source,
  );
}

function clauseNode(
  node: SyntaxNode,
  source: string,
  defaultOperator: 'and' | 'or',
): TreeQuery | null {
  const primitive = childNamed(node, 'Primitive');
  if (!primitive) {return null;}

  const query = primitiveNode(primitive, source, defaultOperator);
  if (!query) {return null;}

  const boostNode = childNamed(node, 'Boost');
  if (!boostNode) {return query;}

  const boostText = source.slice(boostNode.from, boostNode.to);
  const boost = Number(boostText.slice(1));
  if (!Number.isFinite(boost)) {return query;}

  return {
    ...query,
    boost,
    span: {
      from: query.span.from,
      to: node.to,
    },
    raw: source.slice(query.span.from, node.to),
  };
}

function primitiveNode(
  node: SyntaxNode,
  source: string,
  defaultOperator: 'and' | 'or',
): TreeQuery | null {
  const child = namedChildren(node)[0];
  if (!child) {return null;}

  return primitiveChild(child, source, defaultOperator);
}

function primitiveChild(
  child: SyntaxNode,
  source: string,
  defaultOperator: 'and' | 'or',
): TreeQuery | null {
  switch (child.name) {
    case 'TermClause':
      return termClause(child, source);
    case 'PhraseClause':
      return phraseClause(child, source);
    case 'Regex':
      return regexClause(child, source);
    case 'Group':
      return groupClause(child, source, defaultOperator);
    case 'EntityToken':
      return entityNode(child, source);
    case 'FieldClause':
      return fieldClause(child, source, defaultOperator);
    case 'FunctionCall':
      return functionCall(child, source, defaultOperator);
    default:
      return null;
  }
}

function termClause(node: SyntaxNode, source: string): TreeQuery | null {
  const child = namedChildren(node)[0];
  if (!child) {return null;}

  if (child.name === 'FuzzyTerm') {return fuzzyTerm(child, source);}

  if (child.name === 'PrefixWildcardTerm')
  {return prefixWildcardTerm(child, source);}

  return null;
}

function fuzzyTerm(
  node: SyntaxNode,
  source: string,
): FuzzyQuery | TermQuery | null {
  const term = childNamed(node, 'Term');
  if (!term) {return null;}

  const value = unescape(source.slice(term.from, term.to));
  const fuzzy = childNamed(node, 'Fuzzy');
  if (!fuzzy)
  {return withBase(
      { type: 'term', value } satisfies Omit<TermQuery, keyof ASTBase>,
      node,
      source,
  );}

  const integer = childNamed(fuzzy, 'Integer');
  const distance = integer
    ? Number(source.slice(integer.from, integer.to))
    : undefined;

  return withBase(
    {
      type: 'fuzzy',
      value,
      ...(distance !== undefined ? { distance } : {}),
    } satisfies Omit<FuzzyQuery, keyof ASTBase>,
    node,
    source,
  );
}

function prefixWildcardTerm(
  node: SyntaxNode,
  source: string,
): PrefixWildcardQuery | null {
  const term = childNamed(node, 'Term');
  if (!term) {return null;}

  const value = unescape(source.slice(term.from, term.to));
  return withBase(
    { type: 'prefix-wildcard', value } satisfies Omit<
      PrefixWildcardQuery,
      keyof ASTBase
    >,
    node,
    source,
  );
}

function phraseClause(node: SyntaxNode, source: string): PhraseQuery | null {
  const phrase = childNamed(node, 'Phrase');
  if (!phrase) {return null;}

  const raw = source.slice(phrase.from, phrase.to);
  const value = unescape(raw.slice(1, -1));
  const proximity = childNamed(node, 'Proximity');

  let distance: number | undefined;
  if (proximity) {
    const integer = childNamed(proximity, 'Integer');
    if (integer) {distance = Number(source.slice(integer.from, integer.to));}
  }

  return withBase(
    {
      type: 'phrase',
      value,
      ...(distance !== undefined ? { proximity: distance } : {}),
    } satisfies Omit<PhraseQuery, keyof ASTBase>,
    node,
    source,
  );
}

function regexClause(node: SyntaxNode, source: string): RegexQuery | null {
  const raw = source.slice(node.from, node.to);
  if (raw.length < 2) {return null;}

  const value = unescape(raw.slice(1, -1));
  return withBase(
    { type: 'regex', value } satisfies Omit<RegexQuery, keyof ASTBase>,
    node,
    source,
  );
}

function groupClause(
  node: SyntaxNode,
  source: string,
  defaultOperator: 'and' | 'or',
): TreeQuery | null {
  const expressions = childrenNamed(node, 'Expression')
    .map((child) => expression(child, source, defaultOperator))
    .filter((x): x is TreeQuery => x !== null);

  if (expressions.length === 0) {return null;}

  return expressions.length === 1
    ? expressions[0]
    : group(expressions, source, defaultOperator);
}

function entityNode(node: SyntaxNode, source: string): EntityQuery | null {
  const raw = source.slice(node.from, node.to);
  const match = entityTokenExactRegex.exec(raw);
  if (!match) {return null;}

  return withBase(
    {
      type: 'entity',
      entityType: decodeURIComponent(match[1]),
      id: decodeURIComponent(match[2]),
      label: decodeURIComponent(match[3]),
    } satisfies Omit<EntityQuery, keyof ASTBase>,
    node,
    source,
  );
}

function fieldClause(
  node: SyntaxNode,
  source: string,
  defaultOperator: 'and' | 'or',
): FieldQuery | null {
  // The ":" literal is a node too, so the value is the last child rather than the second
  const field = childNamed(node, 'Term');
  const value = node.lastChild;
  if (!field || !value || value === field) {return null;}

  const clause = primitiveChild(value, source, defaultOperator);
  if (!clause) {return null;}

  return withBase(
    {
      type: 'field',
      field: unescape(source.slice(field.from, field.to)),
      clause,
    } satisfies Omit<FieldQuery, keyof ASTBase>,
    node,
    source,
  );
}

function functionCall(
  node: SyntaxNode,
  source: string,
  defaultOperator: 'and' | 'or',
): ContainmentQuery | NearQuery | null {
  // Lezer recovers from e.g. a missing ")" with an error node, don't guess what was meant
  if (namedChildren(node).some((child) => child.type.isError)) {return null;}

  const name = childNamed(node, 'FunctionName');
  if (!name) {return null;}

  const args = childrenNamed(node, 'Expression').map((child) =>
    expression(child, source, defaultOperator),
  );
  if (args.some((arg) => arg === null)) {return null;}
  const clauses = args as TreeQuery[];

  const integer = childNamed(node, 'Integer');
  const distance = integer
    ? Number(source.slice(integer.from, integer.to))
    : undefined;

  const functionName = source.slice(name.from, name.to);
  switch (functionName) {
    case 'containing':
    case 'notcontaining':
      if (clauses.length !== 2 || distance !== undefined) {return null;}

      return withBase(
        {
          type: functionName,
          container: clauses[0],
          clause: clauses[1],
        } satisfies Omit<ContainmentQuery, keyof ASTBase>,
        node,
        source,
      );
    case 'near':
      if (clauses.length < 2 || distance === undefined) {return null;}

      return withBase(
        { type: 'near', clauses, distance } satisfies Omit<
          NearQuery,
          keyof ASTBase
        >,
        node,
        source,
      );
    default:
      return null;
  }
}

function group(
  clauses: TreeQuery[],
  source: string,
  defaultOperator: 'and' | 'or',
): BooleanQuery {
  return {
    type: defaultOperator,
    clauses: flattenBoolean(defaultOperator, clauses),
    span: {
      from: clauses[0].span.from,
      to: clauses[clauses.length - 1].span.to,
    },
    raw: source.slice(
      clauses[0].span.from,
      clauses[clauses.length - 1].span.to,
    ),
  };
}

function flattenBoolean(type: 'and' | 'or', clauses: TreeQuery[]): TreeQuery[] {
  const result: TreeQuery[] = [];
  for (const clause of clauses) {
    if (clause.type === type && clause.boost === undefined)
    {result.push(...clause.clauses);}
    else {result.push(clause);}
  }

  return result;
}

function withBase<T extends object>(
  value: T,
  node: SyntaxNode,
  source: string,
): T & ASTBase {
  return {
    ...value,
    span: {
      from: node.from,
      to: node.to,
    },
    raw: source.slice(node.from, node.to),
  };
}

function namedChildren(node: SyntaxNode): SyntaxNode[] {
  const result: SyntaxNode[] = [];
  for (let child = node.firstChild; child; child = child.nextSibling) {
    if (!child.type.isAnonymous) {result.push(child);}
  }

  return result;
}

function childrenNamed(node: SyntaxNode, name: string): SyntaxNode[] {
  return namedChildren(node).filter((child) => child.name === name);
}

function childNamed(node: SyntaxNode, name: string): SyntaxNode | null {
  return namedChildren(node).find((child) => child.name === name) ?? null;
}
