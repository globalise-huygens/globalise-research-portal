// Editorial content for the landing page. Card destinations are placeholders
// until the first editorial pages are published.
export const landingPageContent = {
  metadata: {
    title: 'Discover the VOC archives · GLOBALISE',
    description: 'Explore the VOC archives with GLOBALISE. Built for researchers, educators and curious audiences worldwide.',
  },
  hero: {
    titleLines: ['Discover the', 'VOC archives'],
    introduction: 'Built for researchers, educators and curious audiences worldwide.',
    searchLabel: 'Search the archive',
  },
  cards: [
    { background: 'var(--color-parchment-600)', hoverColor: 'parchment', label: 'Archive', title: 'VOC shipping records' },
    { background: 'var(--color-brand-vermilion)', hoverColor: 'vermilion', label: 'Video', title: 'Interview with Matthias van Rossum' },
    { background: 'var(--color-turquoise-600)', hoverColor: 'turquoise', label: 'Research', title: 'Digital infrastructure for colonial archives' },
    { background: 'var(--color-brand-mint)', hoverColor: 'mint', label: 'Collection', title: 'New collection:\nWomen & Family\nin Colonial Contexts' },
    { background: 'var(--color-neutral-700)', hoverColor: 'vermilion', label: 'Article', title: 'Research methodology notes' },
    { background: 'var(--color-parchment-800)', hoverColor: 'parchment', label: 'Archive', title: 'Maritime trade documents' },
    { background: 'var(--color-neutral-600)', hoverColor: 'turquoise', label: 'Collection', title: 'Colonial correspondence' },
  ],
  footer: {
    label: 'Website information',
    copyright: 'GLOBALISE 2026',
    informationLabel: 'Website policies and information — coming soon',
  },
} as const;
