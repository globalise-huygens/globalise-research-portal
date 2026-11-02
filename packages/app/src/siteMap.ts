// Snapshot of globalise-portal-content/SITEMAP.md. Source paths identify
// editorial files, not published URLs; the final URL structure is undecided.
export const siteMap = {
  sections: [
    {
      title: 'Explore', source: 'pages/explore/index.md', pages: [
        { title: 'Collections', source: 'pages/explore/collections/README.md' },
        { title: 'Themes', source: 'pages/explore/themes/README.md' },
      ],
    },
    {
      title: 'Learn & get started', source: 'pages/learn-get-started/index.md', pages: [
        { title: 'Searching & browsing', source: 'pages/learn-get-started/searching-browsing/index.md', pages: [
          { title: 'Searching', source: 'pages/learn-get-started/searching-browsing/searching.md' },
          { title: 'Filters & facets', source: 'pages/learn-get-started/searching-browsing/facets.md' },
          { title: 'Browsing', source: 'pages/learn-get-started/searching-browsing/browsing.md' },
          { title: 'Understanding results', source: 'pages/learn-get-started/searching-browsing/results.md' },
        ] },
        { title: 'Using Globalise with an AI assistant', source: 'pages/learn-get-started/ai-assistant.md' },
        { title: 'Research workflow', source: 'pages/learn-get-started/research-workflow.md' },
        { title: 'Citation guide', source: 'pages/learn-get-started/citation.md' },
        { title: 'Licences & reuse', source: 'pages/learn-get-started/licences.md' },
        { title: 'Resources', source: 'pages/learn-get-started/resources/index.md', pages: [
          { title: 'Bibliography', source: 'pages/learn-get-started/resources/bibliography.md' },
          { title: 'Related projects & databases', source: 'pages/learn-get-started/resources/related-projects.md' },
          { title: 'Videos', source: 'pages/learn-get-started/resources/videos.md' },
        ] },
      ],
    },
    {
      title: 'About GLOBALISE', source: 'pages/about/index.md', pages: [
        { title: 'Project & team', pages: [
          { title: 'What is Globalise?', source: 'pages/about/project/index.md' },
          { title: 'Project & ambitions', source: 'pages/about/project/ambitions.md' },
          { title: 'Team & partners', source: 'pages/about/project/team.md' },
          { title: 'Archive', source: 'pages/about/project/archive/index.md' },
        ] },
        { title: 'Methods & outputs', pages: [
          { title: 'Methods', source: 'pages/about/methods.md' },
          { title: 'Outputs', source: 'pages/about/outputs.md' },
        ] },
      ],
    },
    {
      title: 'Research responsibly', source: 'pages/research-responsibly/index.md', pages: [
        { title: 'Ethics & colonial context', source: 'pages/research-responsibly/ethics/index.md', pages: [
          { title: 'Ethics policy', source: 'pages/research-responsibly/ethics/policy.md' },
          { title: 'Colonial context', source: 'pages/research-responsibly/ethics/colonial-context.md' },
          { title: 'Bias & limitations', source: 'pages/research-responsibly/ethics/bias-and-limitations.md' },
          { title: 'Responsible use', source: 'pages/research-responsibly/ethics/responsible-use.md' },
        ] },
        { title: 'Guide to the VOC archives', source: 'pages/research-responsibly/voc-archives-guide.md' },
        { title: 'Data & documentation', source: 'pages/research-responsibly/data/index.md', pages: [
          { title: "What's in the data", source: 'pages/research-responsibly/data/overview.md' },
          { title: 'How the data was produced', source: 'pages/research-responsibly/data/production.md' },
          { title: 'Reference data & entity linking', source: 'pages/research-responsibly/data/reference-data.md' },
          { title: 'Data model & ontologies', source: 'pages/research-responsibly/data/data-model.md' },
          { title: 'Technical documentation', source: 'pages/research-responsibly/data/technical-documentation.md' },
          { title: 'Accessing the data', source: 'pages/research-responsibly/data/access.md' },
        ] },
      ],
    },
  ],
  footer: [
    { title: 'Contact', source: 'pages/footer/contact.md' },
    { title: 'Release notes', source: 'pages/footer/release-notes.md' },
    { title: 'Privacy', source: 'pages/footer/privacy.md' },
    { title: 'Cookies', source: 'pages/footer/cookies.md' },
    { title: 'Accessibility', source: 'pages/footer/accessibility.md' },
    { title: 'Disclaimer', source: 'pages/footer/disclaimer.md' },
    { title: 'Colophon', source: 'pages/footer/colophon.md' },
  ],
} as const;
