import { useState } from 'react';
import { Popover, ToolButton } from '@globalise/design';

export type ErrorMessage = {
  message: string;
};

export function ManifestError({ error }: { error: ErrorMessage }) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return null;
  }

  return (
    <Popover className="manifest-error" role="alert" variant="warning">
      <span>{error.message}</span>
      <ToolButton size="compact" onPress={() => setIsDismissed(true)}>Dismiss</ToolButton>
    </Popover>
  );
}
