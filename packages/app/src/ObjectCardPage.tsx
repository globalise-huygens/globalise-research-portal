import { ObjectCard } from '@globalise/object-card';
import '@globalise/design/styles.css';

const defaultUri =
  'https://data.globalise.huygens.knaw.nl/' +
  'hdl:20.500.14722/thesaurus:225cef07-5b8e-4a8b-a141-2471a0cffce8';

export function ObjectCardPage() {
  return <ObjectCard uri={defaultUri} />;
}
