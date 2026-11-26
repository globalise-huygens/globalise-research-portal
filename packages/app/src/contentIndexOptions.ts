import { getContentIndexServer } from '@globalise/content/serve';

export const contentIndexOptions = {
  queryKey: ['content-index'],
  queryFn: getContentIndexServer,
  staleTime: Infinity,
};
