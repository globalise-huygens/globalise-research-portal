import {
  isMobileManifestView,
  type MobilePanelView,
  type MobileView,
  selectMobileView,
  setTranscriptionMode,
  type TranscriptionMode,
  useMobileSettings,
  useTranscriptionMode,
} from '@globalise/common/document';
import {
  IconScan,
  IconSetting,
  IconTranscriptionDiplomatic,
  IconTranscriptionNormalised,
} from '@globalise/design';
import { MetadataPanel, TocPanel } from '@globalise/metadata';
import * as React from 'react';
import { Button as AriaButton } from 'react-aria-components';
import type { ManifestLayoutProps } from '../layout/ManifestLayout';
import { ManifestCloseButton } from '../layout/ManifestCloseButton';
import { ManifestContentWarning } from '../layout/ManifestContentWarning';
import { ManifestError } from '../layout/ManifestError';
import { type SidebarPanel, useSidebarPanels } from '../layout/useSidebarPanels';
import { ReadingLayoutContext } from './ReadingLayout';
import { ScanNavigationHandle } from './ScanNavigationHandle';
import { ViewerPane } from './ViewerPane';

type MobilePanel = SidebarPanel & { id: MobilePanelView };

type MenuItem = {
  id: MobileView;
  transcriptionMode?: TranscriptionMode;
  label: string;
  description: string;
  icon: React.ReactNode;
};

const readingAreaId = 'manifest-reading-area';
const scanNavigationId = 'manifest-scan-navigation';
const mobilePanelViews: MobilePanelView[] = ['toc', 'inventory'];

const readerItems: MenuItem[] = [
  { id: 'scan', label: 'Scan', description: 'Scan viewer', icon: <IconScan /> },
  { id: 'text', transcriptionMode: 'diplomatic', label: 'Diplomatic', description: 'Diplomatic transcription', icon: <IconTranscriptionDiplomatic /> },
  { id: 'text', transcriptionMode: 'line-by-line', label: 'Normalized', description: 'Normalized transcription', icon: <IconTranscriptionNormalised /> },
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
  const mobilePanels = useMobilePanels();
  const menuItems = [...readerItems, ...mobilePanels.map(toMenuItem)];
  const { selectedView, selectedManifestView } = useMobileSettings();
  const transcriptionMode = useTranscriptionMode();
  const [isToolsOpen, setIsToolsOpen] = React.useState(false);
  const [isNavigationOpen, setIsNavigationOpen] = React.useState(false);
  const toolsId = React.useId();
  const toolsButtonRef = React.useRef<HTMLButtonElement>(null);
  const panel = mobilePanels.find((panel) => panel.id === selectedView);

  function selectView(next: MobileView) {
    setIsToolsOpen(false);
    if (!isMobileManifestView(next)) {
      setIsNavigationOpen(false);
    }
    selectMobileView(next);
  }

  function isSelected(item: MenuItem) {
    return item.id === selectedView && (!item.transcriptionMode || item.transcriptionMode === transcriptionMode);
  }

  function select(item: MenuItem) {
    selectView(item.id);
    if (item.transcriptionMode) {
      setTranscriptionMode(item.transcriptionMode);
    }
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
              {menuItems.map((item) => <AriaButton key={item.label}
                aria-label={item.description}
                aria-pressed={isSelected(item)}
                aria-controls={readingAreaId}
                onPress={() => select(item)}>
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

function useMobilePanels(): MobilePanel[] {
  const sidebarPanels = useSidebarPanels();
  return mobilePanelViews.flatMap((view) => sidebarPanels.filter((panel): panel is MobilePanel => panel.id === view));
}

function InformationPanel({ panel }: { panel: MobilePanel }) {
  return <section className="mobile-information" aria-label={panel.label}>
    <h2>{panel.label}</h2>
    {panel.id === 'toc' ? <TocPanel /> : <MetadataPanel />}
  </section>;
}

function toMenuItem({ id, shortLabel, label, icon }: MobilePanel): MenuItem {
  return { id, label: shortLabel, description: label, icon };
}
