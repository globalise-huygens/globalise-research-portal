# Design CSS

Use a short kebab-case root class that describes the component or its function, such as `.entity-menu` or `.viewer-toolbar`. Do not add a package prefix.

Components that belong to the complete manifest interface use `manifest-viewer-*`. Reusable parts keep their own functional root, such as `.viewer-toolbar` or `.entity-menu`.

Internal parts use `data-slot` and are always scoped to the root class:

```css
.entity-menu [data-slot="label"] { /* ... */ }
```

Use semantic `data-*`, ARIA attributes, or pseudo-classes for variants and state. Keep application-specific layout classes in the application package.

`src/styles.css` is the public stylesheet entry. `src/styles/globals.css` contains tokens and shared defaults, `src/components/ui/ui.css` collects general component styles, and a separate `ComponentName.css` is useful when a component family has enough styles to stand on its own.

Some older components still use `gds-` and BEM names. Migrate those when the component is actively changed instead of mixing old and new names in the same component.
