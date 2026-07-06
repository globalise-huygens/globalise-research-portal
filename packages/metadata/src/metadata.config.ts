import {MetadataCategory, MetadataConfig} from './MetadataModel';
import {Doc} from "./registry/Doc.tsx";
import {Li} from "./registry/Li.tsx";

export const metadataConfig: MetadataConfig = {
  categories: [
    {name: 'identification', label: 'Identification'},
    {name: 'production', label: 'Production'},
    {name: 'hierarchy', label: 'Part of'},
    {name: 'documents', label: 'Documents'},
  ],
  rules: [
    {
      sourceMatcher: 'http://vocab.getty.edu/aat/300312355',
      target: {category: 'identification', component: Li.name}
    },
    {
      sourceMatcher: 'http://vocab.getty.edu/aat/300445023',
      target: {category: 'identification', component: Li.name}
    },
    {
      sourceMatcher: 'title',
      target: {category: 'identification', component: Li.name, label: 'Title'}
    },
    {
      sourceMatcher: 'produced_by',
      target: {category: 'production', component: Li.name, label: 'Production'}
    },
    {
      sourceMatcher: 'member_of',
      target: {category: 'hierarchy', component: Li.name, label: 'Part of'}
    },
    {
      sourceMatcher: 'part',
      target: {category: 'documents', component: Doc.name}
    },
  ],
  onNoMatch: 'append',
};