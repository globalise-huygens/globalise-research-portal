import {
  IconContentWarning,
  IconCopy,
  IconDownload,
  ObjectCard,
  ObjectCardAction,
  ObjectCardBody,
  ObjectCardHeader,
  ObjectCardPanel,
  ObjectCardProperty,
  ObjectCardPropertyList,
  ObjectCardSection,
  ObjectCardStat,
  ObjectCardStats,
  ObjectCardTitle,
} from '@globalise/design';
import './ConceptCard.css';
import {
  getConceptLabel,
  ConceptList,
  getSkosUrl,
  MatchList,
  SkosConcept,
  loadConcept,
  useConcept,
} from './';
import { HtmlValue } from './HtmlValue.tsx';
import type { LangValue } from './SkosModel.ts';

export type ConceptCardProps = {
  onClose?: () => void;
};

export function ConceptCard({ onClose }: ConceptCardProps) {
  const { uri, concept, isLoading, isReady, error } = useConcept();

  if (!uri) {
    return <div>No URI</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (isLoading || !isReady || !concept) {
    return <div>Loading...</div>;
  }

  function handleSelect(selected: SkosConcept) {
    void loadConcept(selected.id);
  }

  const conceptUri = uri;
  const url = getSkosUrl(conceptUri);
  const primaryLabel = getPrimaryLabel(concept);
  const title = primaryLabel
    ? formatLabel(primaryLabel)
    : getConceptLabel(concept);
  const otherPreferredLabels = concept.prefLabel.filter(
    (label) => label !== primaryLabel,
  );
  const alternativeLabels = concept.altLabel ?? [];
  const hiddenLabels = concept.hiddenLabel ?? [];
  const definitions = concept.definition ?? [];
  const source = concept.source ?? concept.references;
  const hasAlternativeLabels = Boolean(
    alternativeLabels.length || hiddenLabels.length,
  );
  const hasDefinitions = Boolean(definitions.length || source);
  const hasExternal = (
    (concept.closeMatch?.length ?? 0)
    + (concept.narrowMatch?.length ?? 0)
    + (concept.exactMatch?.length ?? 0)
  ) > 0;
  const hasGraph = (
    (concept.broader?.length ?? 0)
    + (concept.narrower?.length ?? 0)
    + (concept.related?.length ?? 0)
  ) > 0;
  const hasLeftPanel = hasDefinitions || hasExternal;
  const hasBody = hasLeftPanel || hasGraph;
  const hasSinglePanel = hasLeftPanel !== hasGraph;

  function handleCopy() {
    void navigator.clipboard.writeText(conceptUri).catch(console.error);
  }

  function handleOpenJson() {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <ObjectCard className="concept-card">
      <ObjectCardHeader
        onClose={onClose}
        actions={(
          <>
            <ObjectCardAction
              aria-label="Copy concept URI"
              icon={<IconCopy className="concept-card__header-action-icon"/>}
              onPress={handleCopy}
            />
            <ObjectCardAction
              aria-label="Open concept JSON-LD"
              icon={<IconDownload className="concept-card__header-action-icon"/>}
              onPress={handleOpenJson}
            />
          </>
        )}
      >
        <span className="concept-card__badge">Concept</span>
        <ObjectCardTitle>{title}</ObjectCardTitle>
        {!!otherPreferredLabels.length && (
          <ObjectCardStats className="concept-card__preferred-labels">
            {otherPreferredLabels.map((label) => (
              <ObjectCardStat key={`${label['@language']}-${label['@value']}`}>
                {formatLabel(label)}
              </ObjectCardStat>
            ))}
          </ObjectCardStats>
        )}
        {hasAlternativeLabels && (
          <div className="concept-card__alternative-labels">
            <span className="concept-card__alternative-labels-title">
              alternative labels:
            </span>
            {alternativeLabels.map((label) => (
              <span key={`alt-${label['@language']}-${label['@value']}`}>
                {formatLabel(label)}
              </span>
            ))}
            {hiddenLabels.map((label) => (
              <span
                key={`hidden-${label['@language']}-${label['@value']}`}
                className="concept-card__hidden-label"
              >
                <IconContentWarning aria-hidden="true"/>
                {formatLabel(label)}
              </span>
            ))}
          </div>
        )}
      </ObjectCardHeader>
      {hasBody && (
        <ObjectCardBody
          className={hasSinglePanel ? 'concept-card__body--single' : undefined}
        >
          {hasLeftPanel && (
            <ObjectCardPanel side="left">
              {hasDefinitions && (
                <ObjectCardSection
                  title="Definitions"
                  className="concept-card__definitions"
                >
                  <ObjectCardPropertyList>
                    {definitions.map((definition, index) => (
                      <ObjectCardProperty
                        key={`${definition['@language']}-${index}`}
                        label={definition['@language']}
                        value={<HtmlValue value={definition['@value']}/>}
                      />
                    ))}
                    {source && (
                      <ObjectCardProperty
                        label="Source"
                        value={<HtmlValue value={source['@value']}/>}
                      />
                    )}
                  </ObjectCardPropertyList>
                </ObjectCardSection>
              )}
              {hasExternal && (
                <ObjectCardSection
                  title="External"
                  className="concept-card__external"
                >
                  <MatchList title="Close match" matches={concept.closeMatch}/>
                  <MatchList title="Narrow match" matches={concept.narrowMatch}/>
                  <MatchList title="Exact match" matches={concept.exactMatch}/>
                </ObjectCardSection>
              )}
            </ObjectCardPanel>
          )}
          {hasGraph && (
            <ObjectCardPanel side="right">
              <ObjectCardSection
                title="Concept Graph"
                className="concept-card__graph"
              >
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

function getPrimaryLabel(concept: SkosConcept): LangValue | undefined {
  return concept.prefLabel.find((label) => label['@language'] === 'en')
    ?? concept.prefLabel.find((label) => label['@language'] === 'nl')
    ?? concept.prefLabel[0];
}

function formatLabel(label: LangValue): string {
  return `${label['@value']} (${label['@language']})`;
}
