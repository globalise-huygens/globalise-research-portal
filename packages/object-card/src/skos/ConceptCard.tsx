import {
  ObjectCard,
  ObjectCardBody,
  ObjectCardExternalLink,
  ObjectCardFooter,
  ObjectCardHeader,
  ObjectCardPanel,
  ObjectCardStat,
  ObjectCardStats,
  ObjectCardTitle,
} from '@globalise/design';
import './ConceptCard.css';
import { asArray, getJsonUrl } from '@globalise/common';
import {
  getConceptLabel,
  ConceptList,
  LabelList,
  MatchList,
  Reference,
  SkosConcept,
  useConcept,
} from './';
import { OpenResource } from '../OpenResource.tsx';
import { loadResource } from '../resolve';

export function ConceptCard() {
  const { uri, concept } = useConcept();

  if (!uri || !concept) {
    return null;
  }

  function handleSelect(selected: SkosConcept) {
    void loadResource(selected.id);
  }

  const url = getJsonUrl(uri);
  const title = getConceptLabel(concept);
  const types = asArray(concept.type);
  const notations = asArray(concept.notation);

  return (
    <ObjectCard className="concept-card">
      <ObjectCardHeader actions={<OpenResource/>}>
        <ObjectCardTitle>{title}</ObjectCardTitle>
        <ObjectCardStats>
          <ObjectCardStat>{types.join(', ')}</ObjectCardStat>
          {!!notations.length && (
            <ObjectCardStat>notation: {notations.join(', ')}</ObjectCardStat>
          )}
        </ObjectCardStats>
      </ObjectCardHeader>
      <ObjectCardBody>
        <ObjectCardPanel side="left">
          <LabelList title="prefLabel" values={concept.prefLabel}/>
          <LabelList title="altLabel" values={concept.altLabel}/>
          <LabelList title="hiddenLabel" values={concept.hiddenLabel}/>
          <LabelList title="definition" values={concept.definition}/>
          <Reference title="references" value={concept.references}/>
        </ObjectCardPanel>
        <ObjectCardPanel side="right">
          <ConceptList
            title="inScheme"
            concepts={concept.inScheme}
            onSelect={handleSelect}
          />
          <ConceptList
            title="hasTopConcept"
            concepts={concept.hasTopConcept}
            onSelect={handleSelect}
          />
          <ConceptList
            title="broader"
            concepts={concept.broader}
            childKey="broader"
            onSelect={handleSelect}
          />
          <ConceptList
            title="narrower"
            concepts={concept.narrower}
            childKey="narrower"
            onSelect={handleSelect}
          />
          <ConceptList
            title="related"
            concepts={concept.related}
            onSelect={handleSelect}
          />
          <MatchList title="closeMatch" matches={concept.closeMatch}/>
          <MatchList title="narrowMatch" matches={concept.narrowMatch}/>
          <MatchList title="exactMatch" matches={concept.exactMatch}/>
        </ObjectCardPanel>
      </ObjectCardBody>
      <ObjectCardFooter>
        <ObjectCardExternalLink href={url}>raw</ObjectCardExternalLink>
        {concept.source && (
          <ObjectCardExternalLink href={concept.source['@value']}>
            {concept.source['@value']}
          </ObjectCardExternalLink>
        )}
      </ObjectCardFooter>
    </ObjectCard>
  );
}
