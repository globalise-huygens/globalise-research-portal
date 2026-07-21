# Design components and CSS

The design package contains reusable, presentational UI primitives. Components that know about manifests, scans, transcriptions, metadata, or application layout belong to the package that owns that feature.

## Ownership

- `@globalise/design` owns reusable controls and surfaces such as `ToolButton`, `Toggle`, `Checkbox`, `FloatingToolbar`, `Popover`, and `Tooltip`.
- `@globalise/manifest` owns `ManifestViewer`, its shell, content warning, metadata sidebar, and manifest-specific controls.
- `@globalise/facsimile` and `@globalise/transcription` own mode-specific UI. Use explicit names such as `FacsimileTooltip` when a generic name would hide that ownership.
- `@globalise/metadata` owns the metadata panel and table of contents, including its scan cards.

Keep the design component hierarchy flat under `src/components/ui`. Do not create a generic `viewer`, `legacy`, or category-bucket directory such as `surfaces`. A file name should identify the component it implements.

## Component names

Name a component for the concept it represents, not its position in a particular page. Use the shortest unambiguous name within the owning package:

```text
ManifestViewer       feature-specific composition
FloatingToolbar      reusable visual primitive
FacsimileTooltip     feature-specific tooltip
Popover              reusable surface
```

Avoid vague container names such as `Surface`, `Wrapper`, or `Layout` unless that is the component's actual public responsibility. Avoid compatibility aliases when the old component has no live consumers.

## CSS names

Give each standalone component a short kebab-case root class without a package prefix:

```css
.floating-toolbar { /* ... */ }
.entity-menu { /* ... */ }
.manifest-viewer { /* ... */ }
```

For internal parts, use a short ordinary class scoped beneath the component root:

```css
.manifest-viewer .top-bar { /* ... */ }
.entity-menu .content { /* ... */ }
```

Prefer semantic descendants when the element already expresses the part:

```css
.entity-menu h3 { /* ... */ }
```

Use ARIA attributes, pseudo-classes, and semantic `data-*` attributes for state or variants. Do not add a `data-*` attribute merely as a styling or query hook when an existing class or ARIA state expresses the same meaning.

Existing `gds-` and BEM names may be migrated when their component is actively changed. Do not mix old and new naming systems inside one component.

## Public CSS

`src/styles.css` is the public stylesheet entry. `src/styles/globals.css` contains shared tokens and defaults, while `src/components/ui/ui.css` collects component styles. A component with meaningful standalone styling should keep it in a matching `ComponentName.css` file.
