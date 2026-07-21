import { getSkosUrl } from './ObjectCardModel.ts';
import { IconExternalLink } from '@globalise/design';
import { useConcept } from './ConceptSlice.ts';
import './ObjectCard.css';
import { ConceptList } from './ConceptList.tsx';
import { LabelList } from './LabelList.tsx';

export function ObjectCard() {
  const { uri, concept, isLoading, isReady, error } = useConcept();

  if (!uri) {
    return <div>No URI</div>;
  }
  const url = uri && getSkosUrl(uri);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (isLoading || !isReady || !concept) {
    return <div>Loading...</div>;
  }

  console.log(ObjectCard.name, { uri, concept });
  return (
    <div className="object-card">
      <h1>{concept._label ?? concept.id}</h1>
      <p>
        {concept.type} | {!!url && <a href={url} target="_blank">
          Source <IconExternalLink className="inline-icon"/>
        </a>}
      </p>
      <ConceptList title="inScheme" concepts={concept.inScheme} />
      <LabelList title="prefLabel" values={concept.prefLabel} />
      <LabelList title="dcterms:title" values={concept['dcterms:title']} />
      <LabelList title="altLabel" values={concept.altLabel} />
      <ConceptList title="hasTopConcept" concepts={concept.hasTopConcept} />
      <ConceptList title="broader" concepts={concept.broader} />
      <ConceptList title="narrower" concepts={concept.narrower} />
    </div>
  );
}

