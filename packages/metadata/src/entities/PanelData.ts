export type PanelData<T> =
  | { status: PanelMessageStatus }
  | { status: 'ready'; data: T };

export type PanelMessageStatus = 'noDocument' | 'loading' | 'failed';

export function mapPanelData<T, U>(
  panelData: PanelData<T>,
  toData: (data: T) => U,
): PanelData<U> {
  return panelData.status === 'ready'
    ? { status: 'ready', data: toData(panelData.data) }
    : panelData;
}
