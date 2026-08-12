import './ConceptCard.css';
import {
  IconContentWarning,
  IconCopy,
  IconExternalLink,
  ObjectCard,
  ObjectCardAction,
  ObjectCardBody,
  ObjectCardHeader,
  ObjectCardPanel,
  ObjectCardProperty,
  ObjectCardPropertyList,
  ObjectCardSection,
  ObjectCardTitle,
} from '@globalise/design';
import {
  ConceptList,
  getConceptLabel,
  getLanguageDisplayName,
  getPreferredLabel,
  getSkosUrl,
  loadConcept,
  MatchList,
  SkosConcept,
  useConcept,
} from './';
import { HtmlValue } from './HtmlValue.tsx';

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
  const preferredLabels = concept.prefLabel ?? [];
  const primaryLabel = getPreferredLabel(concept);
  const title = primaryLabel?.['@value'] ?? getConceptLabel(concept);
  const titleLanguage = primaryLabel
    ? getLanguageDisplayName(primaryLabel['@language'])
    : undefined;
  const additionalPreferredLabels = preferredLabels.filter(
    (label) => label !== primaryLabel,
  );
  const alternativeLabels = concept.altLabel ?? [];
  const hiddenLabels = concept.hiddenLabel ?? [];
  const definitions = concept.definition ?? [];
  const source = concept.source;
  const references = concept.references;
  const hasLabels = Boolean(
    additionalPreferredLabels.length
      || alternativeLabels.length
      || hiddenLabels.length,
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
              icon={<IconExternalLink className="header-action-icon" />}
              onPress={handleOpenJson}
            />
          </>
        }
      >
        <span className="badge">Concept</span>
        <ObjectCardTitle>
          <span lang={primaryLabel?.['@language']}>
            {title}
          </span>
          {titleLanguage && (
            <span className="title-language">({titleLanguage})</span>
          )}
        </ObjectCardTitle>
        {hasLabels && (
          <div className="label-groups">
            {!!additionalPreferredLabels.length && (
              <div className="label-group">
                <span className="label-group-title">preferred labels:</span>
                {additionalPreferredLabels.map((label) => (
                  <ConceptLabel
                    key={`pref-${label['@language']}-${label['@value']}`}
                    label={label}
                  />
                ))}
              </div>
            )}
            {!!(alternativeLabels.length || hiddenLabels.length) && (
              <div className="label-group alternative-labels">
                <span className="label-group-title">alternative labels:</span>
                {alternativeLabels.map((label) => (
                  <ConceptLabel
                    key={`alt-${label['@language']}-${label['@value']}`}
                    label={label}
                    isAlternative
                  />
                ))}
                {hiddenLabels.map((label) => (
                  <ConceptLabel
                    key={`hidden-${label['@language']}-${label['@value']}`}
                    label={label}
                    isHidden
                  />
                ))}
              </div>
            )}
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

type ConceptLabelProps = {
  label: { '@language': string; '@value': string };
  isAlternative?: boolean;
  isHidden?: boolean;
};

function ConceptLabel({
  label,
  isAlternative,
  isHidden,
}: ConceptLabelProps) {
  const language = getLanguageDisplayName(label['@language']);
  const className = [
    'concept-label-value',
    isAlternative ? 'alternative-label' : undefined,
    isHidden ? 'hidden-label' : undefined,
  ].filter(Boolean).join(' ');

  return (
    <span className={className}>
      {isHidden && <IconContentWarning aria-hidden="true" />}
      <span lang={label['@language'] || undefined}>{label['@value']}</span>
      {language && <span className="label-language">({language})</span>}
    </span>
  );
}
