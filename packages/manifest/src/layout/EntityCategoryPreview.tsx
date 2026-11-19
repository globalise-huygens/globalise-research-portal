import { findByPath, getValue } from '@globalise/common';
import {
  getEntityClassificationUri,
  type CidocEntityClassificationId,
} from '@globalise/common/annotation';
import { EntityIcon, EntityPreviewCard, PopoverCard } from '@globalise/design';
import { entityResourceQueryOptions, RelationLink } from '@globalise/object-card';
import { toHref } from '@globalise/router';
import { useQuery } from '@tanstack/react-query';
import type { AriaAttributes, ReactNode } from 'react';

export type EntityCategoryPreviewData = {
  uri: string;
  classificationIds?: CidocEntityClassificationId[];
  conceptUri?: string;
  isAppellativeSubject?: boolean;
};

export function EntityCategoryPreview({
  data,
  label,
  openOnTouch = true,
  children,
}: {
  data: EntityCategoryPreviewData;
  label: string;
  openOnTouch?: boolean;
  children: (attributes: AriaAttributes) => ReactNode;
}) {
  return (
    <PopoverCard
      label={`${label} preview`}
      preferBeside
      closeOnFocusLeave
      openOnTouch={openOnTouch}
      openOnPress={openOnTouch}
      renderTrigger={children}
    >
      <EntityCategoryPreviewContent data={data} />
    </PopoverCard>
  );
}

function EntityCategoryPreviewContent({ data }: { data: EntityCategoryPreviewData }) {
  const { data: resource, isPending, isError } = useQuery(entityResourceQueryOptions(data.uri));
  const title = getValue(resource?.prefLabel) || data.uri;
  const definition = getValue(resource?.definition);
  const broader = resource && data.conceptUri
    ? findByPath(resource, ['broader']).filter((node) => node.id)
    : [];

  return (
    <EntityPreviewCard data={{
      type: 'concept',
      icon: <EntityIcon type="concept" />,
      title: isPending ? 'Loading preview…' : title,
      openFullCardHref: toHref({ to: '/object-card', search: { uri: data.uri } }),
      properties: [
        ...(isError || (!isPending && !resource)
          ? [{ label: 'Details', value: 'Unable to load concept details.' }]
          : []),
        ...(definition ? [{ label: 'Definition', value: definition }] : []),
        ...(broader.length ? [{
          label: 'Broader',
          value: broader.map((node, index) => (
            <span key={node.id}>
              {index > 0 && ', '}
              <RelationLink node={{ id: node.id, type: node.type }} />
            </span>
          )),
        }] : []),
        ...(data.classificationIds?.length ? [{
          label: 'NER categories',
          value: data.classificationIds.map((id, index) => (
            <span key={id}>
              {index > 0 && ', '}
              <RelationLink node={{ id: getEntityClassificationUri(id), type: 'Concept' }} />
            </span>
          )),
        }] : []),
        ...(data.conceptUri ? [{
          label: data.isAppellativeSubject ? 'Appellative subject concept' : 'Concept',
          value: <RelationLink node={{ id: data.conceptUri, type: 'Concept' }} />,
        }] : []),
      ],
    }} />
  );
}
