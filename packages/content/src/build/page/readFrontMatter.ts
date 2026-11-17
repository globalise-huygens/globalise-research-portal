import { isMap, isNode, isScalar, LineCounter, parseDocument } from 'yaml';
import { createErrorIssue } from '../Issue.ts';
import type { Root, Yaml } from 'mdast';
import type { Point } from 'unist';
import type { Document, YAMLError } from 'yaml';
import type { Issue } from '../Issue.ts';

export type FrontMatter = {
  fields: Record<string, unknown>;
  places: Map<string, Point>;
};

type LinePos = ReturnType<LineCounter['linePos']>;

const emptyFrontMatter: FrontMatter = { fields: {}, places: new Map() };

export function readFrontMatter(markdown: Root): {
  frontMatter?: FrontMatter;
  issues: Issue[];
} {
  const yaml = markdown.children.find((node): node is Yaml => node.type === 'yaml');
  if (!yaml) {
    return { frontMatter: emptyFrontMatter, issues: [] };
  }
  const lineCounter = new LineCounter();
  const document = parseDocument(yaml.value, { lineCounter });
  const [error] = document.errors;
  if (error) {
    const reason = `Invalid front matter: ${formatYamlReason(error)}`;
    const place = toPlace(yaml, error.linePos?.[0]);
    return { issues: [createErrorIssue(reason, 'invalid-front-matter', place)] };
  }
  const parsed: unknown = document.toJS();
  const frontMatter = {
    fields: isRecord(parsed) ? parsed : {},
    places: readPlaces(document, yaml, lineCounter),
  };
  return { frontMatter, issues: [] };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function formatYamlReason(error: YAMLError): string {
  const [firstLine] = error.message.split('\n');
  return firstLine.replace(/ at line \d+, column \d+:$/, '');
}

function readPlaces(
  document: Document,
  yaml: Yaml,
  lineCounter: LineCounter,
): Map<string, Point> {
  const places = new Map<string, Point>();
  if (!isMap(document.contents)) {
    return places;
  }
  for (const { key, value } of document.contents.items) {
    const offset = isNode(value)
      ? value.range?.[0]
      : undefined;
    const place = offset === undefined
      ? undefined
      : toPlace(yaml, lineCounter.linePos(offset));
    if (isScalar(key) && place) {
      places.set(String(key.value), place);
    }
  }
  return places;
}

function toPlace(yaml: Yaml, position?: LinePos): Point | undefined {
  const yamlStartLine = yaml.position?.start.line ?? 1;
  return position && {
    line: yamlStartLine + position.line,
    column: position.col,
  };
}
