import { Link } from 'react-aria-components';
import { getRouteApi, toHref } from '@globalise/router';
import { Container, IconArrowRight, IconSearch, Typography } from '@globalise/design';
import type { PageMeta } from '@globalise/content';
import { HomeHeroCards } from './HomeHeroCards';
import { landingPageContent } from './landingPageContent';
import './Home.css';

const route = getRouteApi('/');

export function Home() {
  const featuredPosts: PageMeta[] = route.useLoaderData();

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
        <HomeHeroCards featuredPosts={featuredPosts} />
      </main>
    </div>
  );
}
