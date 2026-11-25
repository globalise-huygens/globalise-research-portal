import './SiteFooter.css';
import { toHref, useRouter } from '@globalise/router';
import { useQuery } from '@tanstack/react-query';
import { contentIndexOptions } from './contentIndexOptions.ts';
import { Link } from 'react-aria-components';
import { Container } from '@globalise/design';
import { landingPageContent } from './landingPageContent';
import { siteMap } from './siteMap';

type SiteMapPage = {
  readonly title?: string;
  readonly source?: string;
  readonly to?: '/content/blog';
  readonly pages?: readonly SiteMapPage[];
};

export function SiteFooter() {
  const router = useRouter();
  const { data: contentIndex = [] } = useQuery(contentIndexOptions);
  const pagesBySource = new Map(contentIndex.map((page) => [page.path, page]));
  const footer = landingPageContent.footer;

  return (
    <footer className="site-footer" aria-label={footer.label}>
      <Container>
        <div className="footer-groups">
          {siteMap.sections.map(({ title, pages }) => (
            <section key={title}>
              <h2>{title}</h2>
              <ul>
                {footerPages(pages).map((entry) => {
                  const page = entry.source
                    ? pagesBySource.get(entry.source)
                    : undefined;
                  const href = entry.to
                    ? toHref({ to: entry.to })
                    : page && isPublished(page.status)
                      ? router.buildLocation({
                        to: '/content/$slug',
                        params: { slug: page.slug },
                      }).href
                      : undefined;

                  return (
                    <li key={entry.title}>
                      {href
                        ? <Link href={href}>{entry.title}</Link>
                        : entry.title}
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
        <div className="footer-bottom">
          <span>{footer.copyright}</span>
          <ul aria-label={footer.informationLabel}>
            {siteMap.footer.map((page) => (
              <li key={page.title}>{page.title}</li>
            ))}
          </ul>
          <span>v{__APP_VERSION__}</span>
        </div>
      </Container>
    </footer>
  );
}

function footerPages(pages: readonly SiteMapPage[]): SiteMapPage[] {
  return pages.flatMap((page) => {
    const children = footerPages(page.pages ?? []);
    if (!page.title) {
      return children;
    }
    return [page, ...children.filter((child) => child.to)];
  });
}

function isPublished(status: string): boolean {
  return status === 'approved' || status === 'published';
}
