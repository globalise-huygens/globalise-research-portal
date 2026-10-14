import { useMemo } from 'react';
import { Tooltip } from '@globalise/design';
export type FacsimileTooltipProps = { text: string; trigger: Element };

export function FacsimileTooltip({ text, trigger, onDismiss }: FacsimileTooltipProps & { onDismiss: () => void }) {
  const triggerRef = useMemo(() => ({ current: trigger }), [trigger]);
  return (
    <Tooltip label={text} placement="top" isOpen triggerRef={triggerRef}
      onOpenChange={(open) => { if (!open) {onDismiss();} }}>
      {null}
    </Tooltip>
  );
}
