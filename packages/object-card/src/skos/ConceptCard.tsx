import './ConceptCard.css';
import {
  IconConcept,
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
import {
  getJsonUrl,
  getPreferredLanguageValue,
  type LanguageValue,
} from '@globalise/common';
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
  const preferredLabels = concept.prefLabel ?? [];
  const primaryLabel = getPreferredLanguageValue(preferredLabels);
  const title = getConceptLabel(concept);
  const titleLanguageTag = primaryLabel
    ? getLanguageTag(primaryLabel['@language'])
    : undefined;
  const titleLanguage = titleLanguageTag
    ? getLanguageDisplayName(titleLanguageTag)
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
        <span className="badge">
          <IconConcept aria-hidden="true" className="concept-icon" />
          Concept
        </span>
        <ObjectCardTitle>
          <span lang={titleLanguageTag}>{title}</span>
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
                        label={getLanguageTag(definition['@language']) ?? '-'}
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

type ConceptLabelProps = {
  label: LanguageValue;
  isAlternative?: boolean;
  isHidden?: boolean;
};

function ConceptLabel({
  label,
  isAlternative,
  isHidden,
}: ConceptLabelProps) {
  const languageTag = getLanguageTag(label['@language']);
  const language = languageTag
    ? getLanguageDisplayName(languageTag)
    : undefined;
  const className = [
    'concept-label-value',
    isAlternative ? 'alternative-label' : undefined,
    isHidden ? 'hidden-label' : undefined,
  ].filter(Boolean).join(' ');

  return (
    <span className={className}>
      {isHidden && <IconContentWarning aria-hidden="true" />}
      <span lang={languageTag}>{label['@value']}</span>
      {language && <span className="label-language">({language})</span>}
    </span>
  );
}

const languageDisplayNames = new Intl.DisplayNames(['en'], {
  type: 'language',
});

function getLanguageTag(language: string): string | undefined {
  const normalized = language.trim();
  return normalized && normalized !== '?' ? normalized : undefined;
}

function getLanguageDisplayName(language: string): string {
  try {
    return languageDisplayNames.of(language) ?? language;
  } catch {
    return language;
  }
}
