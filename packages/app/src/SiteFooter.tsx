import './SiteFooter.css';
import { Container } from '@globalise/design';
import { landingPageContent } from './landingPageContent';
import { siteMap } from './siteMap';

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
                {pages.map((page) => (
                  <li key={page.title}>{page.title}</li>
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
        </div>
      </Container>
    </footer>
  );
}
