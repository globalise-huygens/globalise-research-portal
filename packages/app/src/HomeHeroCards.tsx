import { CardHero } from '@globalise/design';
import { landingPageContent } from './landingPageContent';
import './HomeHeroCards.css';

export function HomeHeroCards() {
  return (
    <div className="home-hero-cards">
      <ul>
        {landingPageContent.cards.map(({ label, title }) => (
          <li key={title}>
            <CardHero
              label={label}
              title={title}
              tabIndex={0}
            >
              <div className="home-hero-card-placeholder" aria-hidden="true" />
            </CardHero>
          </li>
        ))}
      </ul>
    </div>
  );
}
