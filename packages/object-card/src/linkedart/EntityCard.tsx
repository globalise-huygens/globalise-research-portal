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
import { getShipTitle, ShipCardBody, ShipOverview } from './ShipCardBody.tsx';
import { PlaceCardBody } from './place/PlaceCardBody.tsx';
import { PlaceOverview } from './place/PlaceOverview.tsx';
import { PolityCardBody, getPolityTitle } from './polity/PolityCardBody.tsx';
import './EntityCard.css';

export function EntityCard() {
  const { uri, entity } = useEntity();

  if (!uri || !entity) {
    return null;
  }

  const identifiers = getEntityIdentifiers(entity);
  const sources = findByPath(entity, ['referred_to_by']);
  const entityType = getLinkedArtEntityType(uri);

  let cardClass = 'entity-card';
  let title = getEntityTitle(entity);
  let body;
  if (entityType === 'person') {
    cardClass += ' person-card';
    title = getPersonTitle(entity);
    body = <PersonCardBody entity={entity} />;
  } else if (entityType === 'ship') {
    cardClass += ' ship-card';
    title = getShipTitle(entity);
    body = <ShipCardBody entity={entity} />;
  } else if (entityType === 'polity') {
    cardClass += ' polity-card';
    title = getPolityTitle(entity);
    body = <PolityCardBody entity={entity} />;
  } else if (entityType === 'place') {
    cardClass += ' place-card';
    body = <PlaceCardBody entity={entity} />;
  }
  const showIdentifiers = !body && identifiers.length > 0;

  return (
    <ObjectCard className={cardClass}>
      <ObjectCardHeader
        actions={
          <>
            <CardCopyAction uri={uri} label="Copy entity URI" />
            <CardOpenAction url={getJsonUrl(uri)} label="Open entity JSON-LD" />
          </>
        }
      >
        <EntityTypeBadge type={entityType} />
        <ObjectCardTitle>{title}</ObjectCardTitle>
        {entityType === 'person' && <PersonOverview entity={entity} />}
        {entityType === 'ship' && <ShipOverview entity={entity} />}
        {entityType === 'place' && <PlaceOverview entity={entity} />}
        {showIdentifiers && (
          <ObjectCardStats>
            <ObjectCardStat>{identifiers.join(', ')}</ObjectCardStat>
          </ObjectCardStats>
        )}
      </ObjectCardHeader>
      {body ?? (
        <ObjectCardBody>
          <ObjectCardPanel side="left">
            <EntitySummary entity={entity} />
            {eventKeys.map((labeledKey) => (
              <EventSection
                key={labeledKey.key}
                entity={entity}
                labeledKey={labeledKey}
              />
            ))}
            {!!sources.length && <SourceList sources={sources} />}
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
