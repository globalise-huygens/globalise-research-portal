import { findByPath, getValue, type LinkedArtNode } from '@globalise/common';
import {
  getEntityClassificationUri,
  type CidocEntityClassificationId,
} from '@globalise/common/annotation';
import {
  EntityIcon,
  EntityPreviewCard,
  WrappingPopoverCard,
  type EntityPreviewCardProperty,
  type PopoverCardOpening,
} from '@globalise/design';
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
  opening = 'label',
  children,
}: {
  data: EntityCategoryPreviewData;
  label: string;
  opening?: PopoverCardOpening;
  children: (attributes: AriaAttributes) => ReactNode;
}) {
  return (
    <WrappingPopoverCard
      label={`${label} preview`}
      content={<EntityCategoryPreviewContent data={data} />}
      placement="beside"
      opening={opening}
      trigger={children}
    />
  );
}

function EntityCategoryPreviewContent({
  data,
}: { data: EntityCategoryPreviewData }) {
  const { data: resource, isPending, isError } = useQuery(
    entityResourceQueryOptions(data.uri),
  );
  const recordedTitle = getValue(resource?.prefLabel) || data.uri;
  const title = isPending ? 'Loading preview…' : recordedTitle;
  const definition = getValue(resource?.definition);
  const broader = resource && data.conceptUri
    ? findByPath(resource, ['broader']).filter((node) => node.id)
    : [];

  const properties: EntityPreviewCardProperty[] = [];
  if (isError || (!isPending && !resource)) {
    properties.push({ label: 'Details', value: 'Unable to load concept details.' });
  }
  if (definition) {
    properties.push({ label: 'Definition', value: definition });
  }
  if (broader.length) {
    properties.push({ label: 'Broader', value: renderRelationLinks(broader) });
  }
  if (data.classificationIds?.length) {
    const classifications = data.classificationIds.map((id) => ({
      id: getEntityClassificationUri(id),
      type: 'Concept',
    }));
    properties.push({
      label: 'NER categories',
      value: renderRelationLinks(classifications),
    });
  }
  if (data.conceptUri) {
    const label = data.isAppellativeSubject ? 'Appellative subject concept' : 'Concept';
    const concept = { id: data.conceptUri, type: 'Concept' };
    properties.push({ label, value: <RelationLink node={concept} /> });
  }

  return <EntityPreviewCard data={{
    type: 'concept',
    icon: <EntityIcon type="concept" />,
    title,
    openFullCardHref: toHref({ to: '/object-card', search: { uri: data.uri } }),
    properties,
  }} />;
}

function renderRelationLinks(nodes: LinkedArtNode[]) {
  return nodes.map(({ id, type }, index) => (
    <span key={id}>
      {index > 0 && ', '}
      <RelationLink node={{ id, type }} />
    </span>
  ));
}
