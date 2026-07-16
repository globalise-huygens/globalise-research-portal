# Design CSS

Use a short kebab-case root class that describes the component or its function, such as `.entity-menu` or `.viewer-toolbar`. Do not add a package prefix.

Reusable parts keep their own functional root, such as `.viewer-toolbar` or `.entity-menu`. Application layout styles stay with the manifest package; retained legacy styles remain isolated under `viewer/legacy`.

The design package provides viewer building blocks; the manifest package composes them with manifest data and application behavior.

Viewer components live in `src/components/ui/viewer` and are available from `@globalise/design/viewer` with short names such as `TopBar` and `ToolButton`. The `legacy` folder keeps viewer behavior that has not yet been transferred; do not add new work there.

Internal parts use `data-slot` and are always scoped to the root class:

```css
.entity-menu [data-slot="label"] { /* ... */ }
```

Use semantic `data-*`, ARIA attributes, or pseudo-classes for variants and state. Keep application-specific layout classes in the application package.

`src/styles.css` is the public stylesheet entry. `src/styles/globals.css` contains tokens and shared defaults, `src/components/ui/ui.css` collects general component styles, and a separate `ComponentName.css` is useful when a component family has enough styles to stand on its own.

Some older components still use `gds-` and BEM names. Migrate those when the component is actively changed instead of mixing old and new names in the same component.
