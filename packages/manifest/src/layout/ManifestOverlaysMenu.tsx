import { useContext, useMemo, useState, type ReactNode } from 'react';
import {
  Dialog, DialogTrigger, Popover as OverlayPopover,
} from 'react-aria-components';
import { Checkbox, IconLayers, Popover } from '@globalise/design';
import {
  setLayoutElementsVisible, useIsLayoutElementsVisible,
} from '@globalise/common/document';
import { ViewerDisplayContext } from './ViewerDisplayContext';
import { TooltipIconButton } from './TooltipIconButton';
import { TOP_BAR_BUTTON } from './buttonClasses';
import './ManifestOverlaysMenu.css';

/** Keep visibility changes outside the viewer components and their layout. */
export function ManifestDisplaySettings({ children }: { children: ReactNode }) {
  const [showScanNumbers, setShowScanNumbers] = useState(true);
  const [showDocumentStarts, setShowDocumentStarts] = useState(true);
  const settings = useMemo(() => ({
    showScanNumbers,
    showDocumentStarts,
    setShowScanNumbers,
    setShowDocumentStarts,
  }), [showScanNumbers, showDocumentStarts]);

  return (
    <ViewerDisplayContext.Provider value={settings}>
      <div
        className="manifest-display-settings"
        data-scan-numbers={showScanNumbers}
        data-document-starts={showDocumentStarts}
      >
        {children}
      </div>
    </ViewerDisplayContext.Provider>
  );
}

export function ManifestOverlaysMenu() {
  const settings = useContext(ViewerDisplayContext);
  const showLayoutElements = useIsLayoutElementsVisible();

  return (
    <DialogTrigger>
      <TooltipIconButton
        aria-label="Overlays"
        tooltip="Overlays"
        className={TOP_BAR_BUTTON}
        icon={<IconLayers className="toolbar-icon" aria-hidden="true" />}
      />
      <OverlayPopover
        placement="bottom end"
        offset={8}
        containerPadding={8}
        className="viewer-overlays-menu-overlay"
      >
        <Dialog aria-label="Overlays" className="viewer-overlays-menu-dialog">
          <Popover size="compact" className="viewer-overlays-menu">
            <Checkbox
              aria-label="Scan numbers"
              isSelected={settings.showScanNumbers}
              onChange={settings.setShowScanNumbers}
            >
              Scan numbers
            </Checkbox>
            <Checkbox
              aria-label="Document starts"
              isSelected={settings.showDocumentStarts}
              onChange={settings.setShowDocumentStarts}
            >
              Document starts
            </Checkbox>
            <Checkbox
              aria-label="Layout elements and line numbers"
              isSelected={showLayoutElements}
              onChange={setLayoutElementsVisible}
            >
              Layout elements and line numbers
            </Checkbox>
          </Popover>
        </Dialog>
      </OverlayPopover>
    </DialogTrigger>
  );
}
