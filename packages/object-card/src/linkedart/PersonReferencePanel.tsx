import type { LinkedArtNode } from '@globalise/common';
import { ReferencePanel } from '@globalise/design';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPersonReferenceLinks, loadPersonReferences } from './PersonReferenceModel.ts';

export function PersonReferencePanel({ entity }: { entity: LinkedArtNode }) {
  const queryClient = useQueryClient();
  const links = getPersonReferenceLinks(entity);
  const { data } = useQuery({
    queryKey: ['person-references', entity.id, entity.subject_of],
    queryFn: () => loadPersonReferences(entity, queryClient),
    enabled: links.length > 0,
    retry: false,
  });

  return (
    <ReferencePanel
      title="References"
      className="person-reference-panel"
      items={data ?? links}
      progressiveLoading
    />
  );
}
