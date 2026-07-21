# naming notes

the main idea: keep this simple. names should tell us what something actually is, and files should live with the feature that owns them.

- `design` is only for small things we can really reuse, like `ToolButton`, `Toggle`, `Checkbox`, `FloatingToolbar`, `Popover`, and `Tooltip`.
- manifest-specific things stay in `manifest`. so: `ManifestViewer`, the content warning, the metadata sidebar, and the manifest controls.
- facsimile, transcription, and metadata-specific things stay in their own packages. for example `FacsimileTooltip`, not just another generic `Tooltip`.
- no general `/viewer/` or `/legacy/` folders. and also no vague bucket files like `Surfaces.tsx`.
- name the component after what it is, not only where it happens to sit on the screen.
- use the shortest name that is still clear. `ManifestViewer`, `FloatingToolbar`, `Popover`, etc.
- avoid names like `Surface`, `Wrapper`, or `Layout` when they do not really explain anything.
- do not keep compatibility aliases when nothing uses the old name anymore.

for css:

- each component gets one short kebab-case root, like `.manifest-viewer`, `.floating-toolbar`, or `.entity-menu`.
- parts inside it can stay short because they are scoped: `.manifest-viewer .top-bar`, `.entity-menu .content`.
- if the html already explains the part, just use that: `.entity-menu h3`.
- use aria, pseudo-classes, or `data-*` for real state. not only as another styling hook.
- do not mix the old BEM / `gds-` naming and the new naming inside the same component. older files can be cleaned up when we actually work on them.

`src/styles.css` stays the public css entry. shared tokens are in `src/styles/globals.css`, general component css is collected by `src/components/ui/ui.css`, and a component can have its own matching css file when needed.
