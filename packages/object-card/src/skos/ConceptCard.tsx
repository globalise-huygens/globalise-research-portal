import './ConceptCard.css';
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
import {
  ConceptList,
  getConceptLabel,
  getSkosUrl,
  loadConcept,
  MatchList,
  SkosConcept,
  useConcept,
} from './';
import { HtmlValue } from './HtmlValue.tsx';
import type { LangValue } from './SkosModel.ts';

export function ConceptCard() {
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
  const hasExternal =
    (concept.closeMatch?.length ?? 0) +
      (concept.narrowMatch?.length ?? 0) +
      (concept.exactMatch?.length ?? 0) >
    0;
  const hasGraph =
    (concept.broader?.length ?? 0) +
      (concept.narrower?.length ?? 0) +
      (concept.related?.length ?? 0) >
    0;
  const hasLeftPanel = hasDefinitions || hasExternal;
  const hasBody = hasLeftPanel || hasGraph;
  const hasSinglePanel = hasLeftPanel !== hasGraph;
  const hasSplitDetails = hasDefinitions && hasExternal;
  const isRightOnly = hasGraph && !hasLeftPanel;
  const isLeftOnly = hasLeftPanel && !hasGraph;
  const definitionsClassName = hasExternal
    ? 'definitions definitions-with-external'
    : 'definitions';
  const cardClassName = ['concept-card', !hasBody ? 'header-only' : undefined]
    .filter(Boolean)
    .join(' ');
  const bodyClassName =
    [
      hasSinglePanel ? 'single-panel' : undefined,
      isLeftOnly ? 'single-left' : undefined,
      isRightOnly ? 'single-right' : undefined,
      hasSplitDetails && hasGraph
        ? 'wide-details'
        : undefined,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

  function handleCopy() {
    void navigator.clipboard.writeText(conceptUri).catch(console.error);
  }

  function handleOpenJson() {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <ObjectCard className={cardClassName}>
      <ObjectCardHeader
        actions={
          <>
            <ObjectCardAction
              aria-label="Copy concept URI"
              icon={<IconCopy className="header-action-icon" />}
              onPress={handleCopy}
            />
            <ObjectCardAction
              aria-label="Open concept JSON-LD"
              icon={
                <IconDownload className="header-action-icon" />
              }
              onPress={handleOpenJson}
            />
          </>
        }
      >
        <span className="badge">Concept</span>
        <ObjectCardTitle>{title}</ObjectCardTitle>
        {!!otherPreferredLabels.length && (
          <ObjectCardStats className="preferred-labels">
            {otherPreferredLabels.map((label) => (
              <ObjectCardStat key={`${label['@language']}-${label['@value']}`}>
                {formatLabel(label)}
              </ObjectCardStat>
            ))}
          </ObjectCardStats>
        )}
        {hasAlternativeLabels && (
          <div className="alternative-labels">
            <span className="alternative-title">
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
                className="hidden-label"
              >
                <IconContentWarning aria-hidden="true" />
                {formatLabel(label)}
              </span>
            ))}
          </div>
        )}
      </ObjectCardHeader>
      {hasBody && (
        <ObjectCardBody className={bodyClassName}>
          {hasLeftPanel && (
            <ObjectCardPanel
              side="left"
              className={
                hasSplitDetails ? 'details-split' : undefined
              }
            >
              {hasDefinitions && (
                <ObjectCardSection
                  title="Definitions"
                  className={definitionsClassName}
                >
                  <ObjectCardPropertyList>
                    {definitions.map((definition, index) => (
                      <ObjectCardProperty
                        key={`${definition['@language']}-${index}`}
                        label={definition['@language']}
                        value={<HtmlValue value={definition['@value']} />}
                      />
                    ))}
                    {source && (
                      <ObjectCardProperty
                        label="Source"
                        value={<HtmlValue value={source['@value']} />}
                      />
                    )}
                  </ObjectCardPropertyList>
                </ObjectCardSection>
              )}
              {hasExternal && (
                <ObjectCardSection
                  title="External"
                  className="external"
                >
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
              <ObjectCardSection
                title="Concept Graph"
                className="graph"
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
  return (
    concept.prefLabel.find((label) => label['@language'] === 'en') ??
    concept.prefLabel.find((label) => label['@language'] === 'nl') ??
    concept.prefLabel[0]
  );
}

function formatLabel(label: LangValue): string {
  return `${label['@value']} (${label['@language']})`;
}
