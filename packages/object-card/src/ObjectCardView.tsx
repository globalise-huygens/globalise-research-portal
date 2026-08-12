import { useCard } from './CardSlice.ts';
import { ConceptCard, SchemeList } from './skos';
import { EntityCard } from './linkedart';

export function ObjectCardView() {
  const { type, isReady, error } = useCard();

  if (error) {
    return <div>Error: {error}</div>;
  }
  if (!isReady) {
    return <div>Loading...</div>;
  }
  if (type === 'skos') {
    return (
      <>
        <SchemeList/>
        <hr/>
        <ConceptCard/>
      </>
    );
  }
  if (type === 'entity') {
    return <EntityCard/>;
  }
  return null;
}
