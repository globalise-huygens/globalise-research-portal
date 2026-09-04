import { loadObjectCard } from './CardSlice.ts';

/**
 * Open a concept or entity in the global object-card modal.
 */
export function useNavigateToObjectCard() {
  return (uri: string) => { void loadObjectCard(uri); };
}
