import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TranscriptionMode = 'diplomatic' | 'line-by-line';
export type MobileManifestView = 'scan' | 'text';
export type MobilePanelView = 'toc' | 'inventory';
export type MobileView = 'viewer' | MobilePanelView;
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
  transcriptionMode: 'line-by-line',
  diplomaticViewScale: 100,
  responsive: {
    desktop: {
      paneRatio: 0.5,
    },
    mobile: {
      selectedView: 'viewer',
      selectedManifestView: 'text',
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

export function setMobileSettings(settings: Partial<MobileSettings>) {
  const { mobile } = useSettingsStore.getState().responsive;
  setResponsiveSettings({ mobile: { ...mobile, ...settings } });
}

export function resetScaling() {
  const { diplomaticViewScale, responsive } = defaultSettings;
  useSettingsStore.setState({ diplomaticViewScale });
  setResponsiveSettings({ desktop: responsive.desktop });
}

function setResponsiveSettings(settings: Partial<ResponsiveSettings>) {
  useSettingsStore.setState(({ responsive }) => ({ responsive: { ...responsive, ...settings } }));
}
