import { Client } from '@elastic/elasticsearch';

const url = 'https://search.globalise.nl';

const elastic = new Client({
  node: url,
  headers: { 'accept-encoding': 'gzip' },
});

export default elastic;
