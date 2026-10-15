import { FloatingToolbar, IconClose, ToolButton } from '@globalise/design';
import { useContext, type ReactNode } from 'react';
import { ManifestEntityHighlightMenu } from './ManifestEntityHighlightMenu';
import { ManifestLayoutElementsToggle } from './ManifestLayoutElementsToggle';
import { ReadingToolsContext } from './ReadingToolsContext';

export function ManifestReadingToolbar({ children }: { children: ReactNode }) {
  const tools = useContext(ReadingToolsContext);
  if (!tools) {return <FloatingToolbar>{children}</FloatingToolbar>;}
  return <FloatingToolbar id={tools.id}
    hidden={!tools.isOpen} role="group" aria-label="Reading tools"
    onKeyDown={(event) => {
      if (event.key === 'Escape' && !event.defaultPrevented) {
        event.preventDefault();
        tools.onClose();
      }
    }}>
    <div className="mobile-tools-heading">
      <span>Reading tools</span>
      <ToolButton aria-label="Close reading tools" icon={<IconClose />} onPress={tools.onClose} size="touch" />
    </div>
    <div className="mobile-reading-controls" role="group" aria-label="View controls">{children}</div>
    <div className="mobile-highlight-controls" role="group" aria-label="Highlight controls">
      <span>Highlights</span>
      <ManifestEntityHighlightMenu />
      <ManifestLayoutElementsToggle />
    </div>
  </FloatingToolbar>;
}
