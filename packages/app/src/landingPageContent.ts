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
    { label: 'Archive', title: 'VOC shipping records' },
    { label: 'Video', title: 'Interview with Matthias van Rossum' },
    { label: 'Research', title: 'Digital infrastructure for colonial archives' },
    { label: 'Collection', title: 'New collection:\nWomen & Family\nin Colonial Contexts' },
    { label: 'Article', title: 'Research methodology notes' },
    { label: 'Archive', title: 'Maritime trade documents' },
    { label: 'Collection', title: 'Colonial correspondence' },
  ],
  footer: {
    label: 'Website information',
    copyright: 'GLOBALISE 2026',
    informationLabel: 'Website policies and information — coming soon',
  },
} as const;
