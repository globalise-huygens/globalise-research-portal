import { MatchTarget, MetadataConfig } from './MetadataModel';

export const metadataConfig: MetadataConfig = {
  categories: [
    { name: 'identification', label: 'Identification' },
    { name: 'other', label: 'Other' },
    { name: 'production', label: 'Production' },
    { name: 'hierarchy', label: 'Part of' },
    { name: 'documents', label: 'Documents' },
  ],
  defaultCategory: 'other',
  propsToSkip: [
    'id',
    '@context',
    'type',
    '_label',
    'content',
    'classified_as',
    'identified_by',
  ],
  rules: [
    {
      tags: [
        'http://vocab.getty.edu/aat/300312355',
        'http://vocab.getty.edu/aat/300445023',
      ],
      target: {
        category: 'identification',
        component: 'Li',
      } satisfies MatchTarget,
    },
    {
      tags: ['title'],
      target: { category: 'identification', component: 'Li', label: 'Title' },
    },
    {
      tags: ['produced_by'],
      target: { category: 'production', component: 'Li', label: 'Production' },
    },
    {
      tags: ['member_of'],
      target: { category: 'hierarchy', component: 'Li', label: 'Part of' },
    },
    {
      tags: ['part'],
      target: { category: 'documents', component: 'Doc' },
    },
    {
      tags: ['timespan'],
      target: { category: 'production', component: 'Timespan', label: 'Timespan' },
    },
  ],
  onNoMatch: 'append',
};