import { MatchTarget, MetadataConfig } from './MetadataModel';

const identificationLi = {
  category: 'identification',
  component: 'Li',
} satisfies MatchTarget;

export const metadataConfig: MetadataConfig = {
  categories: [
    { name: 'identification', label: 'Identification' },
    { name: 'production', label: 'Production' },
    { name: 'hierarchy', label: 'Part of' },
    { name: 'documents', label: 'Documents' },
  ],
  rules: [
    {
      sourceMatcher: 'http://vocab.getty.edu/aat/300312355',
      target: identificationLi,
    },
    {
      sourceMatcher: 'http://vocab.getty.edu/aat/300445023',
      target: identificationLi,
    },
    {
      sourceMatcher: 'title',
      target: { category: 'identification', component: 'Li', label: 'Title' },
    },
    {
      sourceMatcher: 'produced_by',
      target: { category: 'production', component: 'Li', label: 'Production' },
    },
    {
      sourceMatcher: 'member_of',
      target: { category: 'hierarchy', component: 'Li', label: 'Part of' },
    },
    {
      sourceMatcher: 'part',
      target: { category: 'documents', component: 'Doc' },
    },
    {
      sourceMatcher: 'timespan',
      target: { category: 'production', component: 'Timespan', label: 'Timespan' },
    },
  ],
  onNoMatch: 'append',
};