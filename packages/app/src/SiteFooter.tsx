import './SiteFooter.css';
import { Container } from '@globalise/design';

// These groups follow issue #129. Planned pages remain text until they have
// published content; do not send visitors to placeholders or missing routes.
const plannedGroups = [
  { title: 'Explore', pages: ['Collections', 'Themes'] },
  {
    title: 'Learn & get started',
    pages: [
      'Searching & browsing',
      'Working with documents',
      'Citing the archive',
    ],
  },
  {
    title: 'About GLOBALISE',
    pages: ['Project & team', 'Methods & outputs', 'Contact'],
  },
  {
    title: 'Research responsibly',
    pages: ['Ethics & colonial context', 'Data & documentation', 'Resources'],
  },
];

const plannedInformation = [
  'Privacy',
  'Cookies',
  'Accessibility',
  'Disclaimer',
  'Colophon',
];

export function SiteFooter() {
  return (
    <footer className="site-footer" aria-label="Website information">
      <Container>
        <div className="footer-groups">
          {plannedGroups.map(({ title, pages }) => (
            <section key={title}>
              <h2>{title}</h2>
              <ul>
                {pages.map((page) => (
                  <li key={page}>{page}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <div className="footer-bottom">
          <span>GLOBALISE 2026</span>
          <ul aria-label="Website policies and information — coming soon">
            {plannedInformation.map((page) => (
              <li key={page}>{page}</li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
