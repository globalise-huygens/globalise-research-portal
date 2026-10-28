import { CardHero } from '@globalise/design';
import './HomeHeroCards.css';

// Design placeholders until the first editorial destinations are published.
const cards = [
  {
    background: 'var(--color-parchment-600)',
    hoverColor: 'parchment',
    label: 'Archive',
    title: 'VOC shipping records',
  },
  {
    background: 'var(--color-brand-vermilion)',
    hoverColor: 'vermilion',
    label: 'Video',
    title: 'Interview with Matthias van Rossum',
  },
  {
    background: 'var(--color-turquoise-600)',
    hoverColor: 'turquoise',
    label: 'Research',
    title: 'Digital infrastructure for colonial archives',
  },
  {
    background: 'var(--color-brand-mint)',
    hoverColor: 'mint',
    label: 'Collection',
    title: 'New collection:\nWomen & Family\nin Colonial Contexts',
  },
  {
    background: 'var(--color-neutral-700)',
    hoverColor: 'vermilion',
    label: 'Article',
    title: 'Research methodology notes',
  },
  {
    background: 'var(--color-parchment-800)',
    hoverColor: 'parchment',
    label: 'Archive',
    title: 'Maritime trade documents',
  },
  {
    background: 'var(--color-neutral-600)',
    hoverColor: 'turquoise',
    label: 'Collection',
    title: 'Colonial correspondence',
  },
] as const;

export function HomeHeroCards() {
  return (
    <div className="home-hero-cards">
      <ul>
        {cards.map(({ background, hoverColor, label, title }) => (
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
