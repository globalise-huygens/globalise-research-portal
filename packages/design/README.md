# Design CSS

Use a short kebab-case root class that describes the component or its function, such as `.entity-menu` or `.facsimile-canvas`. Do not add a package prefix.

Reusable parts keep their own functional root, such as `.viewer-toolbar` or `.entity-menu`. Use a `viewer-` root only for shell primitives that genuinely apply to every viewer mode. Name mode-specific components explicitly, such as `.facsimile-canvas` and `.transcription-canvas`.

Application layout styles stay with the manifest package; retained legacy styles remain isolated under `viewer/legacy`.

The design package provides viewer building blocks; the manifest package composes them with manifest data and application behavior.

Viewer components live in `src/components/ui/viewer` and are available from `@globalise/design/viewer` with short names such as `TopBar` and `ToolButton`. The `legacy` folder keeps viewer behavior that has not yet been transferred; do not add new work there.

Prefer semantic descendant selectors when the HTML element expresses the part clearly:

```css
.entity-menu h3 { /* ... */ }
```

Otherwise, give the part a short ordinary class and scope it to the component root:

```css
.entity-menu .content { /* ... */ }
```

Reserve semantic `data-*`, ARIA attributes, and pseudo-classes for variants and state. A `data-*` attribute should communicate meaning such as tone, level, selection, or expansion; it should not only replace a class. Keep application-specific layout classes in the application package.

`src/styles.css` is the public stylesheet entry. `src/styles/globals.css` contains tokens and shared defaults, `src/components/ui/ui.css` collects general component styles, and a separate `ComponentName.css` is useful when a component family has enough styles to stand on its own.

Some older components still use `gds-` and BEM names. Migrate those when the component is actively changed instead of mixing old and new names in the same component.
