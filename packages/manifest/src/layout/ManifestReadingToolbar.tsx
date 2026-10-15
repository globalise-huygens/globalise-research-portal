import { FloatingToolbar } from '@globalise/design';
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
    {children}
    <span className="toolbar-divider" aria-hidden="true" />
    <ManifestEntityHighlightMenu />
    <ManifestLayoutElementsToggle />
  </FloatingToolbar>;
}
