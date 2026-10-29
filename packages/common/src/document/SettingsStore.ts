import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TranscriptionMode = 'diplomatic' | 'line-by-line';
export type MobileManifestView = 'scan' | 'text';
export type MobileView = MobileManifestView | 'toc' | 'inventory' | 'entities' | 'events';
export type DesktopSettings = {
  paneRatio: number;
};
export type MobileSettings = {
  selectedView: MobileView;
  selectedManifestView: MobileManifestView;
};
export type ResponsiveSettings = {
  desktop: DesktopSettings;
  mobile: MobileSettings;
};
export type SettingsState = {
  transcriptionMode: TranscriptionMode;
  diplomaticViewScale: number;
  responsive: ResponsiveSettings;
};

const defaultSettings: SettingsState = {
  transcriptionMode: 'diplomatic',
  diplomaticViewScale: 100,
  responsive: {
    desktop: {
      paneRatio: 0.5,
    },
    mobile: {
      selectedView: 'scan',
      selectedManifestView: 'scan',
    },
  },
};

export const useSettingsStore = create<SettingsState>()(
  /**
   * Persist settings to localStorage
   * Increment version to overwrite previous versions:
   */
  persist(() => ({ ...defaultSettings }), { name: 'settings', version: 0 }),
);

export function usePaneRatio() {
  return useSettingsStore((state) => state.responsive.desktop.paneRatio);
}

export function useTranscriptionMode() {
  return useSettingsStore((state) => state.transcriptionMode);
}

export function useDiplomaticViewScale() {
  return useSettingsStore((state) => state.diplomaticViewScale);
}

export function useMobileSettings() {
  return useSettingsStore((state) => state.responsive.mobile);
}

export function setPaneRatio(paneRatio: number) {
  setResponsiveSettings({ desktop: { paneRatio } });
}

export function setDiplomaticViewScale(diplomaticScale: number) {
  useSettingsStore.setState({ diplomaticViewScale: diplomaticScale });
}

export function setTranscriptionMode(transcriptionMode: TranscriptionMode) {
  useSettingsStore.setState({ transcriptionMode });
}

export function selectMobileView(selectedView: MobileView) {
  const mobile = useSettingsStore.getState().responsive.mobile;
  const selectedManifestView = isMobileManifestView(selectedView) ? selectedView : mobile.selectedManifestView;
  setResponsiveSettings({ mobile: { selectedView, selectedManifestView } });
}

export function isMobileManifestView(view: MobileView): view is MobileManifestView {
  return view === 'scan' || view === 'text';
}

export function resetScaling() {
  const { diplomaticViewScale, responsive } = defaultSettings;
  useSettingsStore.setState({ diplomaticViewScale });
  setResponsiveSettings({ desktop: responsive.desktop });
}

function setResponsiveSettings(settings: Partial<ResponsiveSettings>) {
  useSettingsStore.setState(({ responsive }) => ({ responsive: { ...responsive, ...settings } }));
}
