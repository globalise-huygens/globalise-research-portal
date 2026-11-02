import { Link } from '@tanstack/react-router';
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
            to="/search"
            hash="archive-search"
            preload={false}
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
