import { describe, expect, it } from 'vitest';
import { VFile } from 'vfile';
import { toHtml } from 'hast-util-to-html';
import { processPage } from './processPage.ts';
import type { Issue } from './Issue.ts';

const validFields = [
  'title: Ethics',
  'slug: ethics',
  'summary: Why',
  'type: page',
  'status: draft',
].join('\n');

describe('processPage', () => {
  it('reads the page meta from the front matter', async () => {
    const { page } = await processPage(createFile(createMarkdown(validFields)));
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
    const file = createFile(createMarkdown('title: A'));
    const { page, issues } = await processPage(file);
    expect(page).toBeUndefined();
    expect(getReasons(issues, true)).toEqual(['Missing required field `slug`']);
  });

  it('builds a page without recommended fields with warnings', async () => {
    const file = createFile(createMarkdown('title: Ethics\nslug: ethics'));
    const { page, issues } = await processPage(file);
    expect(page).toBeDefined();
    expect(getReasons(issues, false)).toEqual([
      'Missing recommended field `summary`',
      'Missing recommended field `type`',
      'Missing recommended field `status`',
    ]);
  });

  it('skips a page with invalid front matter with an error', async () => {
    const file = createFile(createMarkdown('title: Ethics\nslug: [unclosed'));
    const { page, issues } = await processPage(file);
    expect(page).toBeUndefined();
    expect(issues).toMatchObject([
      { ruleId: 'invalid-front-matter', fatal: true, place: { line: 3 } },
    ]);
  });

  it('keeps safe html and drops comments and scripts', async () => {
    const body = '<sup>1</sup><!-- todo --><script>alert(1)</script>';
    const { page } = await processPage(createFile(createValidMarkdown(body)));
    expect(toHtml(page!.htmlTree)).toBe('<p><sup>1</sup></p>');
  });

  it('links footnote references to their footnotes', async () => {
    const file = createFile(createValidMarkdown('A[^1]\n\n[^1]: B'));
    const { page } = await processPage(file);
    const html = toHtml(page!.htmlTree);
    expect(html).toContain('href="#user-content-fn-1"');
    expect(html).toContain('id="user-content-fn-1"');
  });

  it('warns about local references to missing files only', async () => {
    const body = '[gone](gone.md) [web](https://globalise.nl) [top](#top)';
    const file = createFile(createValidMarkdown(body));
    const { issues } = await processPage(file);
    const reasons = getReasons(issues, false);
    expect(reasons).toEqual(['Unresolved reference `gone.md`']);
  });

  it('reports the line of a reference in the page itself', async () => {
    const file = createFile(createValidMarkdown('\n[gone](gone.md)'));
    const { issues } = await processPage(file);
    expect(issues[0].place).toMatchObject({ start: { line: 9 } });
  });
});

function createFile(value: string): VFile {
  return new VFile({ cwd: import.meta.dirname, path: 'page.md', value });
}

function createMarkdown(yaml: string, body = ''): string {
  return `---\n${yaml}\n---\n${body}`;
}

function createValidMarkdown(body: string): string {
  return createMarkdown(validFields, body);
}

function getReasons(issues: Issue[], fatal: boolean): string[] {
  return issues
    .filter((issue) => issue.fatal === fatal)
    .map((issue) => issue.reason);
}
