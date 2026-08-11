import { useCard } from './CardSlice.ts';
import { ConceptCard, SchemeList } from './skos';
import { EntityCard } from './linkedart';

export function ObjectCardView() {
  const { kind, isReady, error } = useCard();

  if (error) {
    return <div>Error: {error}</div>;
  }
  if (!isReady) {
    return <div>Loading...</div>;
  }
  if (kind === 'skos') {
    return (
      <>
        <SchemeList/>
        <hr/>
        <ConceptCard/>
      </>
    );
  }
  if (kind === 'entity') {
    return <EntityCard/>;
  }
  return null;
}
