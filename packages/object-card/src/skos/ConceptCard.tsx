import './ConceptCard.css';
import {
  IconContentWarning,
  ObjectCard,
  ObjectCardBody,
  ObjectCardHeader,
  ObjectCardPanel,
  ObjectCardProperty,
  ObjectCardPropertyList,
  ObjectCardSection,
  ObjectCardTitle,
} from '@globalise/design';
import { getJsonUrl } from '@globalise/common';
import {
  ConceptList,
  getConceptLabel,
  MatchList,
  SkosConcept,
  useConcept,
} from './';
import { CardCopyAction } from '../CardCopyAction.tsx';
import { CardOpenAction } from '../CardOpenAction.tsx';
import { HtmlValue } from './HtmlValue.tsx';
import { useNavigateToObjectCard } from '../useNavigateToObjectCard.ts';

export function ConceptCard() {
  const navigateToObjectCard = useNavigateToObjectCard();
  const { uri, concept } = useConcept();

  if (!uri || !concept) {
    return null;
  }

  function handleSelect(selected: SkosConcept) {
    navigateToObjectCard(selected.id);
  }

  const url = getJsonUrl(uri);
  const title = getConceptLabel(concept);
  const alternativeLabels = concept.altLabel ?? [];
  const hiddenLabels = concept.hiddenLabel ?? [];
  const definitions = concept.definition ?? [];
  const source = concept.source;
  const references = concept.references;
  const hasAlternativeLabels = Boolean(
    alternativeLabels.length || hiddenLabels.length,
  );
  const hasDefinitions =
    definitions.length > 0 || Boolean(source) || Boolean(references);
  const hasExternal =
    (concept.closeMatch?.length ?? 0) +
    (concept.narrowMatch?.length ?? 0) +
    (concept.exactMatch?.length ?? 0) >
    0;
  const hasGraph =
    (concept.inScheme?.length ?? 0) +
    (concept.hasTopConcept?.length ?? 0) +
    (concept.broader?.length ?? 0) +
    (concept.narrower?.length ?? 0) +
    (concept.related?.length ?? 0) >
    0;
  const hasLeftPanel = hasDefinitions || hasExternal;
  const hasBody = hasLeftPanel || hasGraph;
  const cardClassName = ['concept-card', !hasBody ? 'header-only' : undefined]
    .filter(Boolean)
    .join(' ');

  return (
    <ObjectCard className={cardClassName}>
      <ObjectCardHeader
        actions={
          <>
            <CardCopyAction uri={uri} label="Copy concept URI"/>
            <CardOpenAction url={url} label="Open concept JSON-LD"/>
          </>
        }
      >
        <span className="badge">Concept</span>
        <ObjectCardTitle>{title}</ObjectCardTitle>
        {hasAlternativeLabels && (
          <div className="alternative-labels">
            <span className="alternative-title">alternative labels:</span>
            {alternativeLabels.map((label) => (
              <span
                key={`alt-${label['@language']}-${label['@value']}`}
                className="alternative-label"
              >
                <span lang={label['@language'] || undefined}>
                  {label['@value']}
                </span>
                <span className="label-language">
                  [{label['@language'] || 'und'}]
                </span>
              </span>
            ))}
            {hiddenLabels.map((label) => (
              <span
                key={`hidden-${label['@language']}-${label['@value']}`}
                className="hidden-label"
              >
                <IconContentWarning aria-hidden="true" />
                <span lang={label['@language'] || undefined}>
                  {label['@value']}
                </span>
                <span className="label-language">
                  [{label['@language'] || 'und'}]
                </span>
              </span>
            ))}
          </div>
        )}
      </ObjectCardHeader>
      {hasBody && (
        <ObjectCardBody
          className={hasLeftPanel && hasGraph ? undefined : 'single-panel'}
        >
          {hasLeftPanel && (
            <ObjectCardPanel side="left">
              {hasDefinitions && (
                <ObjectCardSection title="Definitions" className="definitions">
                  <ObjectCardPropertyList>
                    {definitions.map((definition, index) => (
                      <ObjectCardProperty
                        key={`${definition['@language']}-${index}`}
                        label={getLanguageLabel(definition['@language'])}
                        value={<HtmlValue value={definition['@value']} />}
                      />
                    ))}
                    {source && (
                      <ObjectCardProperty
                        label="Source"
                        value={<HtmlValue value={source['@value']} />}
                      />
                    )}
                    {references && (
                      <ObjectCardProperty
                        label="References"
                        value={<HtmlValue value={references['@value']} />}
                      />
                    )}
                  </ObjectCardPropertyList>
                </ObjectCardSection>
              )}
              {hasExternal && (
                <ObjectCardSection title="External" className="external">
                  <MatchList title="Close match" matches={concept.closeMatch} />
                  <MatchList
                    title="Narrow match"
                    matches={concept.narrowMatch}
                  />
                  <MatchList title="Exact match" matches={concept.exactMatch} />
                </ObjectCardSection>
              )}
            </ObjectCardPanel>
          )}
          {hasGraph && (
            <ObjectCardPanel side="right">
              <ObjectCardSection title="Concept Graph" className="graph">
                <ConceptList
                  title="Scheme"
                  concepts={concept.inScheme}
                  onSelect={handleSelect}
                />
                <ConceptList
                  title="Top concepts"
                  concepts={concept.hasTopConcept}
                  onSelect={handleSelect}
                />
                <ConceptList
                  title="Broader"
                  concepts={concept.broader}
                  childKey="broader"
                  onSelect={handleSelect}
                />
                <ConceptList
                  title="Narrower"
                  concepts={concept.narrower}
                  childKey="narrower"
                  onSelect={handleSelect}
                />
                <ConceptList
                  title="Related"
                  concepts={concept.related}
                  onSelect={handleSelect}
                />
              </ObjectCardSection>
            </ObjectCardPanel>
          )}
        </ObjectCardBody>
      )}
    </ObjectCard>
  );
}

function getLanguageLabel(language: string): string {
  const normalized = language.trim();
  return normalized && normalized !== '?' ? normalized : '-';
}