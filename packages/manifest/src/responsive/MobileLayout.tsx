import {
  isMobileManifestView,
  type MobileView,
  selectMobileView,
  useMobileSettings,
} from '@globalise/common/document';
import { IconScan, IconSetting, IconTranscription } from '@globalise/design';
import { MetadataPanel, TocPanel } from '@globalise/metadata';
import * as React from 'react';
import { Button as AriaButton } from 'react-aria-components';
import type { ManifestLayoutProps } from '../layout/ManifestLayout';
import { ManifestCloseButton } from '../layout/ManifestCloseButton';
import { ManifestContentWarning } from '../layout/ManifestContentWarning';
import { ManifestError } from '../layout/ManifestError';
import { type SidebarId, type SidebarPanel, useSidebarPanels } from '../layout/useSidebarPanels';
import { ReadingLayoutContext } from './ReadingLayout';
import { ScanNavigationHandle } from './ScanNavigationHandle';
import { ViewerPane } from './ViewerPane';

type MenuItem = {
  id: MobileView;
  label: string;
  description: string;
  icon: React.ReactNode;
};

const readingAreaId = 'manifest-reading-area';
const scanNavigationId = 'manifest-scan-navigation';
const panelOrder: SidebarId[] = ['toc', 'inventory', 'entities', 'events'];

const readerItems: MenuItem[] = [
  { id: 'scan', label: 'Scan', description: 'Scan viewer', icon: <IconScan /> },
  { id: 'text', label: 'Text', description: 'Transcription viewer', icon: <IconTranscription /> },
];

export function MobileLayout({
  topLeft,
  topCenter,
  topRight,
  scan,
  transcription,
  bottom,
  error,
  onClose,
}: ManifestLayoutProps) {
  const sidebarPanels = useSidebarPanels();
  const menuItems = [
    ...readerItems,
    ...panelOrder.flatMap((id) => sidebarPanels.filter((panel) => panel.id === id)).map(toMenuItem),
  ];
  const { selectedView, selectedManifestView } = useMobileSettings();
  const [isToolsOpen, setIsToolsOpen] = React.useState(false);
  const [isNavigationOpen, setIsNavigationOpen] = React.useState(false);
  const toolsId = React.useId();
  const toolsButtonRef = React.useRef<HTMLButtonElement>(null);
  const panel = sidebarPanels.find((panel) => panel.id === selectedView);

  function selectView(next: MobileView) {
    setIsToolsOpen(false);
    if (!isMobileManifestView(next)) {
      setIsNavigationOpen(false);
    }
    selectMobileView(next);
  }

  function closeTools() {
    setIsToolsOpen(false);
    toolsButtonRef.current?.focus();
  }

  return (
    <div className="gds manifest-viewer" data-layout="mobile" data-navigation-open={isNavigationOpen || undefined}>
      <div className="frame">
        <div className="main">
          <header className="top-bar">
            <div className="top-bar-group left">
              <AriaButton ref={toolsButtonRef} className="mobile-tools-button"
                aria-label="Reading tools" aria-expanded={isToolsOpen} aria-controls={toolsId}
                isDisabled={!!panel} onPress={() => setIsToolsOpen((open) => !open)}>
                <IconSetting aria-hidden="true" />Tools
              </AriaButton>
              {topLeft}
            </div>

            <div className="top-bar-center">
              <ManifestContentWarning iconOnly />
              {topCenter}
            </div>

            <div className="top-bar-group right">
              {topRight}
              {onClose && <ManifestCloseButton onClose={onClose} />}
            </div>
          </header>

          <main className="body" id={readingAreaId}>
            {error && <ManifestError error={error}/>}
            <ReadingLayoutContext.Provider value={{ scanFit: 'width', tools: { id: toolsId, isOpen: isToolsOpen, onClose: closeTools } }}>
              <div className="mobile-reader" data-covered={!!panel || undefined} aria-hidden={!!panel} inert={!!panel}>
                <ViewerPane key={selectedManifestView} type={selectedManifestView === 'text' ? 'transcription' : 'scan'}>
                  {selectedManifestView === 'text' ? transcription : scan}
                </ViewerPane>
              </div>
            </ReadingLayoutContext.Provider>
            {panel && <InformationPanel panel={panel} />}
          </main>

          <footer className="bottom-bar">
            {!panel && <ScanNavigationHandle controls={scanNavigationId} isOpen={isNavigationOpen} onOpenChange={setIsNavigationOpen} />}
            <div className="scan-navigation" id={scanNavigationId} hidden={!isNavigationOpen}>{bottom}</div>
            <nav className="mobile-information-menu" aria-label="Viewer information">
              {menuItems.map((item) => <AriaButton key={item.id}
                aria-label={item.description}
                aria-pressed={selectedView === item.id}
                aria-controls={readingAreaId}
                onPress={() => selectView(item.id)}>
                <span aria-hidden="true">{item.icon}</span>
                <span>{item.label}</span>
              </AriaButton>)}
            </nav>
          </footer>
        </div>
      </div>
    </div>
  );
}

function InformationPanel({ panel }: { panel: SidebarPanel }) {
  return <section className="mobile-information" aria-label={panel.label}>
    <h2>{panel.label}</h2>
    {panel.id === 'toc' ? <TocPanel /> : panel.id === 'inventory' ? <MetadataPanel />
      : <p>{panel.label} are not available yet.</p>}
  </section>;
}

function toMenuItem({ id, shortLabel, label, icon }: SidebarPanel): MenuItem {
  return { id, label: shortLabel, description: label, icon };
}
