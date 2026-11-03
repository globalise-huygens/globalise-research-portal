import type { AriaAttributes, ReactNode } from 'react';
import { EntityPreviewCard, type EntityPreviewCardData } from './EntityPreviewCard';
import { PopoverCard } from './PopoverCard';

export function EntityPreview({ data, isPending = false, children, ...props }: {
  data?: EntityPreviewCardData;
  isPending?: boolean;
  children?: (attributes: AriaAttributes) => ReactNode;
  anchor?: Element;
  isHovered?: boolean;
  openImmediately?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const card = data ?? (isPending ? { type: 'entity' as const, title: 'Loading preview…' } : undefined);
  const label = typeof data?.title === 'string' ? `Preview: ${data.title}` : 'Linked resource preview';
  return <PopoverCard {...props} isPending={isPending} label={label} renderTrigger={children}>
    {card && <EntityPreviewCard data={card} />}
  </PopoverCard>;
}
