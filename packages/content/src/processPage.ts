import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import { visit } from 'unist-util-visit';
import { removePosition } from 'unist-util-remove-position';
import { parse, YAMLError } from 'yaml';
import { createErrorIssue, createWarningIssue } from './Issue.ts';
import type { Element, Root as HastRoot } from 'hast';
import type { Root as MdastRoot, Yaml } from 'mdast';
import type { Point } from 'unist';
import type { VFile } from 'vfile';
import type { ContentPage, PageMeta } from './ContentPage.ts';
import type { Issue } from './Issue.ts';

export type ProcessedPage = {
  page?: ContentPage;
  issues: Issue[];
};

type FrontMatter = Record<string, unknown>;

type FrontMatterResult = {
  fields?: FrontMatter;
  issues: Issue[];
};

const requiredFields = ['title', 'slug'] as const;
const recommendedFields = ['summary', 'type', 'status'] as const;
const urlScheme = /^[a-z][a-z0-9+.-]*:/i;
const sanitizeSchema = { ...defaultSchema, clobberPrefix: '' };

const processor = unified()
  .use(remarkParse)
  .use(remarkFrontmatter)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeSanitize, sanitizeSchema);

export async function processPage(file: VFile): Promise<ProcessedPage> {
  const mdast = processor.parse(file);
  const { fields, issues: frontMatterIssues } = readFrontMatter(mdast);
  if (!fields) {
    return { issues: frontMatterIssues };
  }

  const htmlTree = await processor.run(mdast, file);
  const issues = [
    ...findFieldIssues(fields),
    ...findReferenceIssues(htmlTree, file),
  ];
  const meta = readPageMeta(fields, file.path);
  removePosition(htmlTree, { force: true });
  return { page: meta && { meta, htmlTree }, issues };
}

function readFrontMatter(tree: MdastRoot): FrontMatterResult {
  const yaml = tree.children.find((node): node is Yaml => node.type === 'yaml');
  if (!yaml) {
    return { fields: {}, issues: [] };
  }
  try {
    const parsed: unknown = parse(yaml.value);
    const fields = isFrontMatter(parsed)
      ? parsed
      : {};
    return { fields, issues: [] };
  } catch (error) {
    if (!(error instanceof YAMLError)) {
      throw error;
    }
    const reason = `Invalid front matter: ${formatYamlReason(error)}`;
    const place = getYamlErrorPlace(error, yaml);
    const issue = createErrorIssue(reason, 'invalid-front-matter', place);
    return { issues: [issue] };
  }
}

function isFrontMatter(value: unknown): value is FrontMatter {
  return typeof value === 'object' && value !== null;
}

function formatYamlReason(error: YAMLError): string {
  const [firstLine] = error.message.split('\n');
  return firstLine.replace(/ at line \d+, column \d+:$/, '');
}

function getYamlErrorPlace(error: YAMLError, yaml: Yaml): Point | undefined {
  const start = error.linePos?.[0];
  const yamlStartLine = yaml.position?.start.line ?? 1;
  return start && {
    line: yamlStartLine + start.line,
    column: start.col,
  };
}

function findFieldIssues(fields: FrontMatter): Issue[] {
  const isMissing = (field: string) => !readTextField(fields, field);
  const missingRequired = requiredFields.filter(isMissing);
  const missingRecommended = recommendedFields.filter(isMissing);
  return [
    ...missingRequired.map((field) => createMissingFieldIssue(field, true)),
    ...missingRecommended.map((field) => createMissingFieldIssue(field, false)),
  ];
}

function createMissingFieldIssue(field: string, required: boolean): Issue {
  const reason = required
    ? `Missing required field \`${field}\``
    : `Missing recommended field \`${field}\``;
  return required
    ? createErrorIssue(reason, 'missing-field')
    : createWarningIssue(reason, 'missing-field');
}

function readPageMeta(
  fields: FrontMatter,
  path: string,
): PageMeta | undefined {
  const text = (field: string) => readTextField(fields, field);
  const title = text('title');
  const slug = text('slug');
  if (!title || !slug) {
    return undefined;
  }
  return {
    path,
    title,
    slug,
    summary: text('summary'),
    type: text('type'),
    status: text('status'),
  };
}

function readTextField(fields: FrontMatter, field: string): string | undefined {
  const value = fields[field];
  const trimmed = typeof value === 'string'
    ? value.trim()
    : '';
  return trimmed || undefined;
}

function findReferenceIssues(tree: HastRoot, file: VFile): Issue[] {
  const issues: Issue[] = [];
  visit(tree, 'element', (node) => {
    const reference = getLocalReference(node);
    if (reference && !existsSync(resolveReference(file, reference))) {
      const reason = `Unresolved reference \`${reference}\``;
      const place = node.position;
      issues.push(createWarningIssue(reason, 'unresolved-reference', place));
    }
  });
  return issues;
}

function getLocalReference(node: Element): string | undefined {
  const reference = node.properties.href ?? node.properties.src;
  return typeof reference === 'string' && isLocal(reference)
    ? reference
    : undefined;
}

function isLocal(reference: string): boolean {
  const isExternal = urlScheme.test(reference) || reference.startsWith('//');
  const isAnchor = reference.startsWith('#');
  return reference !== '' && !isExternal && !isAnchor;
}

function resolveReference(file: VFile, reference: string): string {
  const [path] = reference.split(/[#?]/);
  const target = decodeURI(path);
  return target.startsWith('/')
    ? resolve(file.cwd, `.${target}`)
    : resolve(file.cwd, file.dirname!, target);
}
