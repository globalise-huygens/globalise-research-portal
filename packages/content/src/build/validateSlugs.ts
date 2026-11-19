import { createErrorIssue } from './Issue.ts';
import type { Issue } from './Issue.ts';
import type { PageBuild } from './page/buildPage.ts';

/**
 * Invalidate:
 * - duplicate slugs
 */
export function validateSlugs(builds: PageBuild[]): PageBuild[] {
  const slugs = new Map<string, string>();
  return builds.map((build) => {
    const slug = build.page?.meta.slug;
    if (!slug) {
      return build;
    }
    const otherPath = slugs.get(slug);
    if (otherPath) {
      const issues = [...build.issues, createDuplicateSlugIssue(slug, otherPath)];
      return { source: build.source, issues };
    }
    slugs.set(slug, build.source.path);
    return build;
  });
}

function createDuplicateSlugIssue(slug: string, otherPath: string): Issue {
  const reason = `Duplicate slug \`${slug}\`, also used by \`${otherPath}\``;
  return createErrorIssue(reason, 'duplicate-slug');
}
