import type { EntityPreviewCardData } from './EntityPreviewCard';
import { AttachedPopoverCard } from './AttachedPopoverCard';
import { getPreviewCardContent } from './previewCardContent';
import { useAttachedHover } from './useAttachedHover';
import { usePopoverCardState } from './usePopoverCardState';

export type AttachedPreviewCardProps = {
  data?: EntityPreviewCardData;
  isPending?: boolean;
  trigger: Element;
  isHovered: boolean;
  openImmediately?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function AttachedPreviewCard(
  {
    data,
    isPending = false,
    trigger,
    isHovered,
    openImmediately,
    onOpenChange,
  }: AttachedPreviewCardProps,
) {
  const { label, content } = getPreviewCardContent(data, isPending);
  const hasContent = Boolean(content);
  const state = usePopoverCardState(trigger, { hasContent, onOpenChange });
  useAttachedHover(state, { isHovered, openImmediately });

  return (
    <AttachedPopoverCard
      state={state}
      label={label}
      content={content}
      isPending={isPending}
    />
  );
}
