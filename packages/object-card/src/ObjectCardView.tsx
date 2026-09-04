import { useCard } from './CardSlice.ts';
import { ConceptCard } from './skos';
import { EntityCard } from './linkedart';

export function ObjectCardView({ onClose }: { onClose?: () => void }) {
  const { type, isReady, error } = useCard();

  if (error) {
    return <div>Error: {error}</div>;
  }
  if (!isReady) {
    return <div>Loading...</div>;
  }
  if (type === 'skos') {
    return <ConceptCard onClose={onClose}/>;
  }
  if (type === 'entity') {
    return <EntityCard onClose={onClose}/>;
  }
  return null;
}
