import { FloatingToolbar, IconClose, ToolButton } from '@globalise/design';
import type { ReactNode } from 'react';
import { ManifestEntityHighlightMenu } from '../layout/ManifestEntityHighlightMenu';
import { ManifestLayoutElementsToggle } from '../layout/ManifestLayoutElementsToggle';
import { useReadingLayout } from './ReadingLayout';

export function ManifestReadingToolbar({ children }: { children: ReactNode }) {
  const { tools } = useReadingLayout();
  if (!tools) {
    return <FloatingToolbar>{children}</FloatingToolbar>;
  }
  return <FloatingToolbar id={tools.id}
    hidden={!tools.isOpen} role="group" aria-label="Reading tools"
    onKeyDown={(event) => {
      if (event.key === 'Escape' && !event.defaultPrevented) {
        event.preventDefault();
        tools.onClose();
      }
    }}>
    <div className="mobile-reading-controls" role="group" aria-label="View controls">{children}</div>
    <div className="mobile-highlight-controls" role="group" aria-label="Highlight controls">
      <ManifestEntityHighlightMenu />
      <ManifestLayoutElementsToggle />
      <ToolButton className="mobile-tools-close" aria-label="Close reading tools" icon={<IconClose />} onPress={tools.onClose} size="touch" />
    </div>
  </FloatingToolbar>;
}
