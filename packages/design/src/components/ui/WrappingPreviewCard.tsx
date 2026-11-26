import type { AriaAttributes, ReactNode } from 'react';
import type { EntityPreviewCardData } from './EntityPreviewCard';
import { getPreviewCardContent } from './previewCardContent';
import { WrappingPopoverCard } from './WrappingPopoverCard';

export function WrappingPreviewCard({ data, isPending = false, children }: {
  data?: EntityPreviewCardData;
  isPending?: boolean;
  children: (attributes: AriaAttributes) => ReactNode;
}) {
  return <WrappingPopoverCard
    {...getPreviewCardContent(data, isPending)}
    isPending={isPending}
    trigger={children}
  />;
}
