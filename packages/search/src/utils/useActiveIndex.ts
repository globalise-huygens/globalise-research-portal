import type { IndexKey } from '../indices';

// In the future, the active index will come from the URL
// This will be influenced by which tab the user is in
export function useActiveIndex(): IndexKey {
  return 'documents';
}