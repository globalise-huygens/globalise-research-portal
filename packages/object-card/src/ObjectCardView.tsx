import { useResource } from './resolve';
import { ConceptCard, SchemeList } from './skos';
import { EntityCard } from './linkedart';
import { CollectionPage } from './hydra';

export function ObjectCardView() {
  const { uri, type, isLoading, isReady, error } = useResource();

  if (!uri) {
    return <div>No URI</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  if (isLoading || !isReady) {
    return <div>Loading...</div>;
  }

  switch (type) {
    case 'skos':
      return (
        <>
          <SchemeList/>
          <hr/>
          <ConceptCard/>
        </>
      );
    case 'entity':
      return <EntityCard/>;
    case 'hydra':
      return <CollectionPage/>;
    default:
      return null;
  }
}
