import type { LinkedArtNode } from '@globalise/common';
import { ReferencePanel } from '@globalise/design';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getEntityReferenceLinks, loadEntityReferences } from './EntityReferenceModel.ts';

export function EntityReferencePanel({ entity }: { entity: LinkedArtNode }) {
  const queryClient = useQueryClient();
  const links = getEntityReferenceLinks(entity);
  const { data } = useQuery({
    queryKey: ['entity-references', entity.id, entity.subject_of],
    queryFn: () => loadEntityReferences(entity, queryClient),
    enabled: links.length > 0,
    retry: false,
  });

  return (
    <ReferencePanel
      title="References"
      className="entity-reference-panel"
      items={data ?? links}
      progressiveLoading
    />
  );
}
