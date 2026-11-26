import {
  ObjectCard,
  ObjectCardBody,
  ObjectCardHeader,
  ObjectCardPanel,
  ObjectCardStat,
  ObjectCardStats,
  ObjectCardTitle,
} from '@globalise/design';
import {
  getEntityIdentifiers,
  getEntityTitle,
  findByPath,
  getLinkedArtEntityType,
  getJsonUrl,
} from '@globalise/common';
import { CardCopyAction } from '../CardCopyAction.tsx';
import { CardOpenAction } from '../CardOpenAction.tsx';
import { eventKeys, relationKeys, statusKeys } from './LabeledKey.ts';
import { EntityTypeBadge } from './EntityTypeBadge.tsx';
import { EntitySummary } from './EntitySummary.tsx';
import { EventSection } from './EventSection.tsx';
import { NodeList } from './NodeList.tsx';
import {
  PersonCardBody,
  PersonOverview,
  getPersonTitle,
} from './PersonCardBody.tsx';
import { SourceList } from './SourceList.tsx';
import { StatusSection } from './StatusSection.tsx';
import { useEntity } from './EntitySlice.ts';
import { PlaceCardBody } from './place/PlaceCardBody.tsx';
import { PlaceOverview } from './place/PlaceOverview.tsx';
import {
  OccurrenceCardBody,
  OccurrenceOverview,
  getOccurrenceTitle,
} from './occurrence/OccurrenceCardBody.tsx';
import {
  ConversionCardBody,
  getConversionTitle,
} from './conversion/ConversionCardBody.tsx';
import './EntityCard.css';

export function EntityCard() {
  const { uri, entity } = useEntity();

  if (!uri || !entity) {
    return null;
  }

  const identifiers = getEntityIdentifiers(entity);
  const sources = findByPath(entity, ['referred_to_by']);
  const entityType = getLinkedArtEntityType(uri);
  const hasSpecialCard = ['person', 'place', 'occurrence', 'conversion']
    .includes(entityType);
  const cardClass = hasSpecialCard
    ? `entity-card ${entityType}-card`
    : 'entity-card';
  let body;
  let title = getEntityTitle(entity);
  if (entityType === 'person') {
    body = <PersonCardBody entity={entity} />;
    title = getPersonTitle(entity);
  } else if (entityType === 'place') {
    body = <PlaceCardBody entity={entity} />;
  } else if (entityType === 'occurrence') {
    body = <OccurrenceCardBody entity={entity} />;
    title = getOccurrenceTitle(entity);
  } else if (entityType === 'conversion') {
    body = <ConversionCardBody entity={entity} />;
    title = getConversionTitle(entity);
  }
  const showIdentifiers = identifiers.length > 0
    && !['person', 'place', 'occurrence', 'conversion'].includes(entityType);

  return (
    <ObjectCard className={cardClass}>
      <ObjectCardHeader
        actions={
          <>
            <CardCopyAction uri={uri} label="Copy entity URI"/>
            <CardOpenAction url={getJsonUrl(uri)} label="Open entity JSON-LD"/>
          </>
        }
      >
        <EntityTypeBadge type={entityType}/>
        <ObjectCardTitle>
          {title}
        </ObjectCardTitle>
        {entityType === 'person' && <PersonOverview entity={entity}/>}
        {entityType === 'place' && <PlaceOverview entity={entity}/>}
        {entityType === 'occurrence' && <OccurrenceOverview entity={entity}/>}
        {showIdentifiers && (
          <ObjectCardStats>
            <ObjectCardStat>{identifiers.join(', ')}</ObjectCardStat>
          </ObjectCardStats>
        )}
      </ObjectCardHeader>
      {body ?? (
        <ObjectCardBody>
          <ObjectCardPanel side="left">
            <EntitySummary entity={entity}/>
            {eventKeys.map((labeledKey) => (
              <EventSection
                key={labeledKey.key}
                entity={entity}
                labeledKey={labeledKey}
              />
            ))}
            {!!sources.length && <SourceList sources={sources}/>}
          </ObjectCardPanel>
          <ObjectCardPanel side="right">
            {statusKeys.map((labeledKey) => (
              <StatusSection
                key={labeledKey.key}
                entity={entity}
                labeledKey={labeledKey}
              />
            ))}
            {relationKeys.map((labeledKey) => (
              <NodeList
                key={labeledKey.key}
                title={labeledKey.label}
                nodes={findByPath(entity, [labeledKey.key])}
              />
            ))}
          </ObjectCardPanel>
        </ObjectCardBody>
      )}
    </ObjectCard>
  );
}
