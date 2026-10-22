import { Link } from '@tanstack/react-router';
import { Container, IconArrowRight, IconSearch, Typography } from '@globalise/design';
import { SiteFooter } from './SiteFooter';
import './Home.css';

export function Home() {
  return (
    <div className="home-page">
      <main id="main-content" className="home-main">
        <Container className="home-hero">
          <Typography variant="display" className="home-title">
            Discover the<br />VOC archives
          </Typography>
          <Typography variant="lead" className="home-introduction">
            Built for researchers, educators and curious audiences worldwide.
          </Typography>
          <Link
            to="/search"
            hash="archive-search"
            preload={false}
            className="home-search"
          >
            <IconSearch aria-hidden="true" />
            <span>Search the archive</span>
            <IconArrowRight aria-hidden="true" />
          </Link>
        </Container>
      </main>
      <SiteFooter />
    </div>
  );
}
