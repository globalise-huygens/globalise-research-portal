export const documentPreviewCss = `.design-preview {
  box-sizing: border-box;
  display: grid;
  min-height: 100vh;
  align-items: start;
  overflow: hidden;
  background: rgb(12 10 9 / 0.8);
  color: var(--color-brand-white);
  font-family: var(--font-sans);
  padding: var(--overlay-document-viewer-inset-top)
    var(--overlay-document-viewer-inset-x)
    var(--overlay-document-viewer-inset-bottom);
}

.design-preview__modal {
  box-sizing: border-box;
  display: grid;
  width: 100%;
  max-width: var(--overlay-document-viewer-frame-max-width);
  margin-inline: auto;
}

.design-preview__dialog {
  box-sizing: border-box;
  width: 100%;
  height: var(--overlay-document-viewer-frame-height);
  overflow: hidden;
  background: var(--color-brand-black);
}`;

export const toolbarCss = `.gds-document-detail-top-bar,
.gds-document-detail-bottom-bar {
  box-sizing: border-box;
  z-index: 20;
  display: flex;
  min-height: var(--overlay-document-viewer-top-bar-height);
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  gap: var(--s24);
  border-bottom: 1px solid rgb(255 255 255 / 0.1);
  background: var(--color-neutral-900);
  color: var(--color-brand-white);
  padding: 0 var(--s24);
}

.gds-document-detail-bottom-bar {
  min-height: var(--overlay-document-viewer-bottom-bar-height);
  border-top: 1px solid rgb(255 255 255 / 0.1);
  border-bottom: 0;
}

.gds-document-detail-bar-group {
  display: flex;
  min-width: 0;
  flex-shrink: 0;
  align-items: center;
  gap: var(--s8);
}

.gds-document-detail-bar-group.center {
  flex: 1;
  justify-content: center;
}

.gds-document-detail-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 1.25rem;
  line-height: 1.2;
}

.gds-document-detail-tool-button {
  box-sizing: border-box;
  display: inline-flex;
  min-width: var(--control);
  height: var(--control);
  align-items: center;
  justify-content: center;
  gap: var(--s8);
  border: 1px solid rgb(255 255 255 / 0.2);
  border-radius: 4px;
  background: rgb(255 255 255 / 0.1);
  color: var(--color-brand-white);
  font: inherit;
  line-height: 1;
  padding: 0 var(--s12);
  cursor: pointer;
  transition:
    background-color 120ms ease,
    border-color 120ms ease,
    color 120ms ease,
    opacity 120ms ease;
}

.gds-document-detail-tool-button:hover,
.gds-document-detail-tool-button[data-hovered] {
  border-color: rgb(255 255 255 / 0.4);
  background: rgb(255 255 255 / 0.16);
}

.gds-document-detail-tool-button:focus-visible,
.gds-document-detail-tool-button[data-focus-visible] {
  outline: 2px solid var(--color-brand-turquoise);
  outline-offset: 2px;
}

.gds-document-detail-tool-button.active,
.gds-document-detail-tool-button[data-selected] {
  border-color: var(--color-brand-white);
  background: var(--color-brand-white);
  color: var(--color-brand-black);
}

@media (max-width: 767px) {
  .gds-document-detail-top-bar {
    min-height: auto;
    flex-wrap: wrap;
    gap: var(--s8);
    padding-block: var(--s8);
  }

  .gds-document-detail-bar-group.center {
    order: 3;
    flex-basis: 100%;
    justify-content: flex-start;
  }
}`;

export const segmentedButtonsCss = `.gds-document-detail-segmented-toggle-group {
  display: inline-flex;
  height: var(--s36);
  align-items: center;
  overflow: hidden;
  border-radius: 6px;
  background: rgb(255 255 255 / 0.1);
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.08);
}

.gds-document-detail-segmented-toggle-group button {
  height: var(--s36);
  min-width: var(--s36);
  border: 0;
  border-right: 1px solid rgb(12 10 9 / 0.7);
  border-radius: 0;
  background: transparent;
  color: rgb(255 255 255 / 0.65);
  padding: 0 var(--s12);
}

.gds-document-detail-segmented-toggle-group button:last-child {
  border-right: 0;
}

.gds-document-detail-segmented-toggle-group button > svg {
  width: var(--s16);
  height: var(--s16);
  flex-shrink: 0;
}

.gds-document-detail-segmented-toggle-item[data-selected],
.gds-document-detail-segmented-toggle-item[aria-pressed="true"] {
  background: var(--color-brand-white);
  color: var(--color-brand-black);
}`;

export const checkboxCss = `.gds-document-detail-checkbox {
  display: inline-flex;
  min-width: 0;
  height: var(--s28);
  align-items: center;
  gap: var(--s8);
  color: var(--color-brand-white);
  font-family: var(--font-sans);
  font-size: 0.625rem;
  line-height: 0.75rem;
  cursor: pointer;
}

.gds-document-detail-checkbox__indicator {
  display: flex;
  width: var(--s12);
  height: var(--s12);
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  background: var(--color-neutral-700);
}

.gds-document-detail-checkbox[data-selected] .gds-document-detail-checkbox__indicator,
.gds-document-detail-checkbox[data-indeterminate] .gds-document-detail-checkbox__indicator {
  background: var(--color-brand-white);
  box-shadow: inset 0 0 0 2px var(--color-neutral-800);
}`;

export const popoverCss = `.gds-document-detail-popover-surface {
  box-sizing: border-box;
  width: min(380px, calc(100vw - var(--s32)));
  border: 1px solid rgb(255 255 255 / 0.2);
  background: var(--color-neutral-900);
  color: var(--color-brand-white);
  font-family: var(--font-sans);
  padding: var(--s16);
  box-shadow: 0 16px 32px rgb(0 0 0 / 0.36);
}

.gds-document-detail-popover-surface[data-size="compact"] {
  width: min(260px, calc(100vw - var(--s32)));
}

.gds-document-detail-popover-surface[data-size="wide"] {
  width: min(520px, calc(100vw - var(--s32)));
}

.gds-document-detail-popover-surface[data-variant="warning"] {
  border-color: rgb(239 68 68 / 0.35);
  color: var(--color-vermilion-500);
}`;

export const sidebarCss = `.gds-document-detail-sidebar {
  display: flex;
  width: var(--overlay-document-viewer-sidebar-width);
  height: 100%;
  flex-shrink: 0;
  flex-direction: column;
  overflow-y: auto;
  border-right: 1px solid rgb(255 255 255 / 0.1);
  background: var(--color-neutral-900);
  color: var(--color-brand-white);
  scrollbar-color: var(--color-neutral-600) transparent;
  scrollbar-width: thin;
}

.gds-document-detail-sidebar-section {
  border-bottom: 1px solid rgb(255 255 255 / 0.1);
}

.gds-document-detail-sidebar-section__button {
  display: flex;
  width: 100%;
  height: var(--s64);
  align-items: center;
  justify-content: space-between;
  gap: var(--s16);
  border: 0;
  background: transparent;
  color: inherit;
  padding: 0 var(--s24);
}`;

export const referencePanelCss = `.reference-panel {
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  gap: var(--row-gap);
  background: var(--color-neutral-800);
  color: var(--color-brand-white);
}

.reference-panel__header {
  background: var(--color-neutral-800);
  padding: var(--panel-pad) var(--panel-pad) var(--row-gap);
}

.reference-panel__item {
  position: relative;
  border-bottom: 1px solid rgb(255 255 255 / 0.2);
  padding: var(--s12);
}

.reference-panel__item::before {
  position: absolute;
  top: var(--s12);
  bottom: var(--s12);
  left: 0;
  width: 1px;
  content: "";
  background: transparent;
}

.reference-panel__item:hover::before {
  background: rgb(255 255 255 / 0.3);
}

.reference-panel__item[aria-current="true"]::before {
  width: 2px;
  background: var(--color-brand-white);
}

.reference-panel__snippet {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  background: var(--color-neutral-700);
  padding: var(--s4) var(--s8);
  font-family: var(--font-serif);
  font-size: 0.75rem;
  font-style: italic;
  line-height: 1rem;
}`;

export const tooltipCss = `.gds-document-detail-tooltip {
  z-index: 50;
  max-width: 240px;
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 0.1);
  background: var(--color-neutral-700);
  color: var(--color-brand-white);
  font-family: var(--font-sans);
  font-size: 0.625rem;
  line-height: 0.75rem;
  padding: var(--s12);
  box-shadow:
    0 6px 14px rgb(0 0 0 / 0.25),
    0 25px 25px rgb(0 0 0 / 0.22),
    0 56px 34px rgb(0 0 0 / 0.13);
}`;
