import { CardHero } from '@globalise/design';
import { toHref, useRouter } from '@globalise/router';
import type { PageMeta } from '@globalise/content';
import { landingPageContent } from './landingPageContent';
import './HomeHeroCards.css';

export function HomeHeroCards({
  featuredPosts,
}: {
  featuredPosts: PageMeta[];
}) {
  const router = useRouter();
  const { archive, blog, featuredPostLabel } = landingPageContent.cards;

  return (
    <div className="home-hero-cards">
      <ul>
        <li>
          <CardHero
            {...archive}
            hoverColor="parchment"
            href={toHref({ to: '/search' })}
          >
            <div className="card-cover" aria-hidden="true"/>
          </CardHero>
        </li>
        <li>
          <CardHero
            {...blog}
            hoverColor="mint"
            href={toHref({ to: '/content/blog' })}
          >
            <div className="card-cover" aria-hidden="true"/>
          </CardHero>
        </li>
        {featuredPosts.map(({ slug, title, hero }) => (
          <li key={slug}>
            <CardHero
              label={featuredPostLabel}
              title={title}
              href={router.buildLocation({
                to: '/content/$slug',
                params: { slug },
              }).href}
            >
              {hero
                ? <img src={hero.src} alt="" loading="lazy"/>
                : <div className="card-cover" aria-hidden="true"/>}
            </CardHero>
          </li>
        ))}
      </ul>
    </div>
  );
}
