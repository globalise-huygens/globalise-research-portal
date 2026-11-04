import { describe, expect, it } from 'vitest';
import { VFile } from 'vfile';
import { toHtml } from 'hast-util-to-html';
import { buildPage } from './buildPage.ts';
import type { Issue, IssueLevel } from '../Issue.ts';

const validFields = [
  'title: Ethics',
  'slug: ethics',
  'summary: Why',
  'type: page',
  'status: draft',
].join('\n');

describe('buildPage', () => {
  it('reads the page meta from the front matter', async () => {
    const { page } = await buildPage(createSource(createMarkdown(validFields)));
    expect(page?.meta).toEqual({
      path: 'page.md',
      title: 'Ethics',
      slug: 'ethics',
      summary: 'Why',
      type: 'page',
      status: 'draft',
    });
  });

  it('skips a page without required fields with an error', async () => {
    const source = createSource(createMarkdown('title: A'));
    const { page, issues } = await buildPage(source);
    expect(page).toBeUndefined();
    expect(getReasons(issues, 'error')).toEqual(['Missing required field `slug`']);
  });

  it('builds a page without recommended fields with warnings', async () => {
    const source = createSource(createMarkdown('title: Ethics\nslug: ethics'));
    const { page, issues } = await buildPage(source);
    expect(page).toBeDefined();
    expect(getReasons(issues, 'warning')).toEqual([
      'Missing recommended field `summary`',
      'Missing recommended field `type`',
      'Missing recommended field `status`',
    ]);
  });

  it('skips a page with a slug the app cannot route to', async () => {
    const fields = validFields.replace('slug: ethics', 'slug: Over Ons');
    const { page, issues } = await buildPage(createSource(createMarkdown(fields)));
    expect(page).toBeUndefined();
    expect(issues).toMatchObject([{
      reason: 'Invalid required field `slug`: use lowercase letters, digits and hyphens',
      ruleId: 'invalid-field',
      level: 'error',
      place: { line: 3, column: 7 },
    }]);
  });

  it('treats an empty field as missing', async () => {
    const source = createSource(createMarkdown('title: Ethics\nslug: ""'));
    const { issues } = await buildPage(source);
    expect(getReasons(issues, 'error')).toEqual(['Missing required field `slug`']);
  });

  it('skips a page with invalid front matter with an error', async () => {
    const source = createSource(createMarkdown('title: Ethics\nslug: [unclosed'));
    const { page, issues } = await buildPage(source);
    expect(page).toBeUndefined();
    expect(issues).toMatchObject([
      { ruleId: 'invalid-front-matter', level: 'error', place: { line: 3 } },
    ]);
  });

  it('keeps safe html and drops comments and scripts', async () => {
    const body = '<sup>1</sup><!-- todo --><script>alert(1)</script>';
    const { page } = await buildPage(createSource(createValidMarkdown(body)));
    expect(toHtml(page!.tree)).toBe('<p><sup>1</sup></p>');
  });

  it('links footnote references to their footnotes', async () => {
    const source = createSource(createValidMarkdown('A[^1]\n\n[^1]: B'));
    const { page } = await buildPage(source);
    const html = toHtml(page!.tree);
    expect(html).toContain('href="#user-content-fn-1"');
    expect(html).toContain('id="user-content-fn-1"');
  });

  it('warns about local links to missing files only', async () => {
    const body = '[gone](gone.md) [web](https://globalise.nl) [top](#top)';
    const source = createSource(createValidMarkdown(body));
    const { issues } = await buildPage(source);
    const reasons = getReasons(issues, 'warning');
    expect(reasons).toEqual(['Unresolved link `gone.md`']);
  });

  it('reports the line of a link in the page itself', async () => {
    const source = createSource(createValidMarkdown('\n[gone](gone.md)'));
    const { issues } = await buildPage(source);
    expect(issues[0].place).toMatchObject({ start: { line: 9 } });
  });
});

function createSource(value: string): VFile {
  return new VFile({ cwd: import.meta.dirname, path: 'page.md', value });
}

function createMarkdown(yaml: string, body = ''): string {
  return `---\n${yaml}\n---\n${body}`;
}

function createValidMarkdown(body: string): string {
  return createMarkdown(validFields, body);
}

function getReasons(issues: Issue[], level: IssueLevel): string[] {
  return issues
    .filter((issue) => issue.level === level)
    .map((issue) => issue.reason);
}
