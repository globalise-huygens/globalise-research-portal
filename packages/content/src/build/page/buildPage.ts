import { removePosition } from 'unist-util-remove-position';
import { convertToHtml } from './convertToHtml.ts';
import { parseMarkdown } from './parseMarkdown.ts';
import { readFrontMatter } from './readFrontMatter.ts';
import { validateFrontMatter } from './validateFrontMatter.ts';
import { validateLinks } from './validateLinks.ts';
import type { VFile } from 'vfile';
import type { ContentPage } from '../../ContentPage.ts';
import type { Issue } from '../Issue.ts';

export type PageBuild = {
  source: VFile;
  page?: ContentPage;
  issues: Issue[];
};

export async function buildPage(source: VFile): Promise<PageBuild> {
  const markdown = parseMarkdown(source);
  const { frontMatter, issues: syntaxIssues } = readFrontMatter(markdown);
  if (!frontMatter) {
    return { source, issues: syntaxIssues };
  }
  const { meta, issues: fieldIssues } = validateFrontMatter(frontMatter, source.path);
  const tree = await convertToHtml(markdown, source);
  const linkIssues = validateLinks(tree, source);
  removePosition(tree, { force: true });
  return {
    source,
    page: meta && { meta, tree },
    issues: [...fieldIssues, ...linkIssues],
  };
}
