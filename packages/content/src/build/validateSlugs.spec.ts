import { describe, expect, it } from 'vitest';
import { VFile } from 'vfile';
import { validateSlugs } from './validateSlugs.ts';
import type { PageBuild } from './page/buildPage.ts';
import { PageMeta } from '../ContentPage.ts';

describe(validateSlugs.name, () => {
  it('invalidates page with duplicate slug, with an error', () => {
    const [first, second] = validateSlugs([
      createBuild('pages/a.md', 'ethics'),
      createBuild('pages/b.md', 'ethics'),
    ]);
    expect(first.page).toBeDefined();
    expect(second.page).toBeUndefined();
    expect(second.issues).toMatchObject([{
      reason: 'Duplicate slug `ethics`, also used by `pages/a.md`',
      level: 'error',
    }]);
  });
});

function createBuild(path: string, slug: string): PageBuild {
  const meta: PageMeta = { path, title: slug, slug };
  return {
    source: new VFile({ path }),
    page: { meta, tree: { type: 'root', children: [] } },
    issues: [],
  };
}
