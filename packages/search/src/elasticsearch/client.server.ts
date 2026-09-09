import { Client } from '@elastic/elasticsearch';

const url = 'https://search.globalise.huygens.knaw.nl';

const elastic = new Client({
  node: url,
});

export default elastic;
