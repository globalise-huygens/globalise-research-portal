import { describe, expect, it } from 'vitest';
import { VFile } from 'vfile';
import { toHtml } from 'hast-util-to-html';
import { buildPage } from './buildPage.ts';
import type { Issue, IssueLevel } from '../Issue.ts';

const mdBody = `# Lorem

Ipsum *dolor* sit amet`;

const frontMatter = [
  'title: Foo',
  'slug: foo-bar',
  'summary: Bar',
  'type: foo',
  'status: bar',
].join('\n');

describe(buildPage.name, () => {
  it('converts a markdown page to html', async () => {
    const md = createMarkdown(frontMatter, mdBody);
    const { page, issues } = await buildPage(createSource(md));
    expect(toHtml(page!.tree)).toBe('<h1>Lorem</h1>\n<p>Ipsum <em>dolor</em> sit amet</p>');
    expect(issues).toEqual([]);
  });

  it('reports both error and warning', async () => {
    const fields = frontMatter.replace('slug: foo-bar', 'slug: Foo Bar');
    const body = 'Lorem [ipsum](dolor.md)';
    const { page, issues } = await buildPage(createSource(createMarkdown(fields, body)));
    expect(page).toBeUndefined();
    expect(getReasons(issues, 'error')).toEqual([
      'Invalid required field `slug`: use lowercase letters, digits and hyphens',
    ]);
    expect(getReasons(issues, 'warning')).toEqual(['Unresolved link `dolor.md`']);
  });

  it('reads the page meta from the front matter', async () => {
    const { page } = await buildPage(createSource(createMarkdown(frontMatter)));
    expect(page?.meta).toEqual({
      path: 'page.md',
      title: 'Foo',
      slug: 'foo-bar',
      summary: 'Bar',
      type: 'foo',
      status: 'bar',
    });
  });

  it('skips a page without required fields with an error', async () => {
    const source = createSource(createMarkdown('title: Foo'));
    const { page, issues } = await buildPage(source);
    expect(page).toBeUndefined();
    expect(getReasons(issues, 'error')).toEqual(['Missing required field `slug`']);
  });

  it('builds a page without recommended fields with warnings', async () => {
    const source = createSource(createMarkdown('title: Foo\nslug: foo-bar'));
    const { page, issues } = await buildPage(source);
    expect(page).toBeDefined();
    expect(getReasons(issues, 'warning')).toEqual([
      'Missing recommended field `summary`',
      'Missing recommended field `type`',
      'Missing recommended field `status`',
    ]);
  });

  it('skips a page with a slug the app cannot route to', async () => {
    const fields = frontMatter.replace('slug: foo-bar', 'slug: Foo Bar');
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
    const source = createSource(createMarkdown('title: Foo\nslug: ""'));
    const { issues } = await buildPage(source);
    expect(getReasons(issues, 'error')).toEqual(['Missing required field `slug`']);
  });

  it('skips a page with invalid front matter with an error', async () => {
    const source = createSource(createMarkdown('title: Foo\nslug: [unclosed'));
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
  return createMarkdown(frontMatter, body);
}

function getReasons(issues: Issue[], level: IssueLevel): string[] {
  return issues
    .filter((issue) => issue.level === level)
    .map((issue) => issue.reason);
}
