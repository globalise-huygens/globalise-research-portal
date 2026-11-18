import { Link } from 'react-aria-components';
import { toHref } from '@globalise/router';
import { Container, IconArrowRight, IconSearch, Typography } from '@globalise/design';
import { SiteFooter } from './SiteFooter';
import { HomeHeroCards } from './HomeHeroCards';
import { landingPageContent } from './landingPageContent';
import './Home.css';

export function Home() {
  return (
    <div className="home-page">
      <main id="main-content" className="home-main">
        <Container className="home-hero">
          <Typography variant="display" className="home-title">
            {landingPageContent.hero.titleLines[0]}<br />{landingPageContent.hero.titleLines[1]}
          </Typography>
          <Typography variant="lead" className="home-introduction">
            {landingPageContent.hero.introduction}
          </Typography>
          <Link
            href={`${toHref({ to: '/search' })}#archive-search`}
            className="home-search"
          >
            <IconSearch aria-hidden="true" />
            <span>{landingPageContent.hero.searchLabel}</span>
            <IconArrowRight aria-hidden="true" />
          </Link>
        </Container>
        <HomeHeroCards />
      </main>
      <SiteFooter />
    </div>
  );
}
