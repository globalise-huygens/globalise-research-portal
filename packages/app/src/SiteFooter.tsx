import './SiteFooter.css';
import { toHref } from '@globalise/router';
import { Link } from 'react-aria-components';
import { Container } from '@globalise/design';
import { landingPageContent } from './landingPageContent';
import { siteMap } from './siteMap';

type SiteMapPage = {
  readonly title?: string;
  readonly to?: '/content/blog';
  readonly pages?: readonly SiteMapPage[];
};

// Keep the existing section labels and include live links nested below them.
function footerPages(pages: readonly SiteMapPage[]): SiteMapPage[] {
  return pages.flatMap((page) => {
    const children = footerPages(page.pages ?? []);
    if (!page.title) {
      return children;
    }
    return [page, ...children.filter((child) => child.to)];
  });
}

// These groups follow issue #129. Planned pages remain text until they have
// published content; do not send visitors to placeholders or missing routes.
export function SiteFooter() {
  const footer = landingPageContent.footer;
  return (
    <footer className="site-footer" aria-label={footer.label}>
      <Container>
        <div className="footer-groups">
          {siteMap.sections.map(({ title, pages }) => (
            <section key={title}>
              <h2>{title}</h2>
              <ul>
                {footerPages(pages).map((page) => (
                  <li key={page.title}>
                    {page.to
                      ? <Link href={toHref({ to: page.to })}>{page.title}</Link>
                      : page.title}
                  </li>
                ))}
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
