import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { visit } from 'unist-util-visit';
import { createWarningIssue } from '../Issue.ts';
import type { Element, Root } from 'hast';
import type { VFile } from 'vfile';
import type { Issue } from '../Issue.ts';

/**
 * Invalidate:
 * - local links to missing files, as warnings
 */
export function validateLocalLinks(tree: Root, source: VFile): Issue[] {
  const issues: Issue[] = [];
  visit(tree, 'element', (node) => {
    const link = readLocalLink(node);
    if (link && !existsSync(resolveLink(source, link))) {
      const reason = `Unresolved link \`${link}\``;
      const place = node.position;
      issues.push(createWarningIssue(reason, 'unresolved-link', place));
    }
  });
  return issues;
}

function readLocalLink(node: Element): string | undefined {
  const link = node.properties.href ?? node.properties.src;
  return typeof link === 'string' && isLocal(link)
    ? link
    : undefined;
}

export function isLocal(link: string): boolean {
  const isEmpty = link === '';
  const hasScheme = URL.canParse(link);
  const isProtocolRelative = link.startsWith('//');
  const isAnchor = link.startsWith('#');
  return !isEmpty && !hasScheme && !isProtocolRelative && !isAnchor;
}

function resolveLink(source: VFile, link: string): string {
  const [path] = link.split(/[#?]/);
  const target = decodeURI(path);
  return target.startsWith('/')
    ? resolve(source.cwd, `.${target}`)
    : resolve(source.cwd, source.dirname!, target);
}
