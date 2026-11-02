import { CardHero } from '@globalise/design';
import { landingPageContent } from './landingPageContent';
import './HomeHeroCards.css';

export function HomeHeroCards() {
  return (
    <div className="home-hero-cards">
      <ul>
        {landingPageContent.cards.map(({ background, hoverColor, label, title }) => (
          <li key={title}>
            <CardHero
              label={label}
              title={title}
              hoverColor={hoverColor}
              tabIndex={0}
            >
              <div style={{ background }} aria-hidden="true" />
            </CardHero>
          </li>
        ))}
      </ul>
    </div>
  );
}
