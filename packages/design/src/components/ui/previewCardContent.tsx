import { EntityPreviewCard, type EntityPreviewCardData } from './EntityPreviewCard';

const loadingCard: EntityPreviewCardData = {
  type: 'entity',
  title: 'Loading preview…',
};

export function getPreviewCardContent(
  data: EntityPreviewCardData | undefined,
  isPending: boolean,
) {
  const card = data ?? (isPending ? loadingCard : undefined);
  const title = data?.title;
  return {
    label: typeof title === 'string' ? `Preview: ${title}` : 'Linked resource preview',
    content: card && <EntityPreviewCard data={card} />,
  };
}
