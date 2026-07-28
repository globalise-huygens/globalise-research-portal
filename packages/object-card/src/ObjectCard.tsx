import { IconExternalLink } from '@globalise/design';
import './ObjectCard.css';
import { asArray } from '@globalise/common';
import { getSkosUrl, useConcept } from './skos';
import { ConceptList, LabelList, MatchList, Reference } from './skos';

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

  const title =
    // Pick english by default:
    concept.prefLabel.find((l) => l['@language'] === 'en')?.['@value']
    // Use dutch when missing:
    ?? concept.prefLabel.find((l) => l['@language'] === 'nl')?.['@value']
    // Use dev label:
    ?? concept._label ?? '';

  return (
    <div className="object-card">
      <h1>{title}</h1>
      <p>
        Type: {asArray(concept.type).join(', ')} | {!!url && <a href={url} target="_blank">
          raw <IconExternalLink className="inline-icon"/>
        </a>}
        {concept.source && <> | <a href={concept.source['@value']} target="_blank">
          {concept.source['@value']} <IconExternalLink className="inline-icon"/>
        </a></>}
      </p>
      <ConceptList title="inScheme" concepts={concept.inScheme} />
      <LabelList title="prefLabel" values={concept.prefLabel} />
      <LabelList title="dcterms:title" values={concept['dcterms:title']} />
      <LabelList title="altLabel" values={concept.altLabel} />
      <LabelList title="definition" values={concept.definition} />
      <ConceptList title="hasTopConcept" concepts={concept.hasTopConcept} />
      <ConceptList title="broader" concepts={concept.broader} childKey="broader" />
      <ConceptList title="narrower" concepts={concept.narrower} childKey="narrower"/>
      <ConceptList title="related" concepts={concept.related} />
      <MatchList title="closeMatch" matches={concept.closeMatch} />
      <MatchList title="narrowMatch" matches={concept.narrowMatch} />
      <MatchList title="exactMatch" matches={concept.exactMatch} />
      <Reference title="references" value={concept.references} />
    </div>
  );
}