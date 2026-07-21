import {
  conceptLabel,
  ConceptRef,
  getSkosUrl,
  LangValue,
} from './ObjectCardModel.ts';
import { IconExternalLink } from '@globalise/design';
import { loadConcept, useConcept } from './ConceptSlice.ts';

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
    <div>
      <h1>{concept._label ?? concept.id}</h1>
      <p>
        {concept.type} | {!!url && <a href={url} target="_blank">
          Source <IconExternalLink className="inline-icon"/>
        </a>}
      </p>
      <LabelList title="prefLabel" values={concept.prefLabel} />
      <LabelList title="dcterms:title" values={concept['dcterms:title']} />
      <LabelList title="altLabel" values={concept.altLabel} />
      <ConceptList title="hasTopConcept" concepts={concept.hasTopConcept} />
      <ConceptList title="broader" concepts={concept.broader} />
      <ConceptList title="narrower" concepts={concept.narrower} />
    </div>
  );
}

type LabelListProps = { title: string; values?: LangValue[] };

function LabelList({ title, values }: LabelListProps) {
  if (!values?.length) {
    return <h2 style={{ color: 'gray' }}>{title}</h2>;
  }
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {values.map((value) => (
          <li key={`${value['@language']}-${value['@value']}`}>
            <strong>{value['@language']}</strong>: {value['@value']}
          </li>
        ))}
      </ul>
    </>
  );
}

type ConceptListProps = { title: string; concepts?: ConceptRef[] };

function ConceptList({ title, concepts }: ConceptListProps) {
  if (!concepts?.length) {
    return <h2 style={{ color: 'gray' }}>{title}</h2>;
  }
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {concepts.map((concept) => (
          <li key={concept.id}>
            <button onClick={() => void loadConcept(concept.id)}>
              {conceptLabel(concept)}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}