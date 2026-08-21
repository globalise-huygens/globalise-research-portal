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
  PersonNameSummary,
  getPersonTitle,
} from './PersonCardBody.tsx';
import { SourceList } from './SourceList.tsx';
import { StatusSection } from './StatusSection.tsx';
import { useEntity } from './EntitySlice.ts';
import './EntityCard.css';

export function EntityCard() {
  const { uri, entity } = useEntity();

  if (!uri || !entity) {
    return null;
  }

  const identifiers = getEntityIdentifiers(entity);
  const sources = findByPath(entity, ['referred_to_by']);
  const entityType = getLinkedArtEntityType(uri);

  return (
    <ObjectCard
      className={entityType === 'person' ? 'entity-card person-card' : 'entity-card'}
    >
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
          {entityType === 'person' ? getPersonTitle(entity) : getEntityTitle(entity)}
        </ObjectCardTitle>
        {entityType === 'person' && <PersonNameSummary entity={entity}/>}
        {entityType !== 'person' && !!identifiers.length && (
          <ObjectCardStats>
            <ObjectCardStat>{identifiers.join(', ')}</ObjectCardStat>
          </ObjectCardStats>
        )}
      </ObjectCardHeader>
      {entityType === 'person' ? (
        <PersonCardBody entity={entity}/>
      ) : (
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
