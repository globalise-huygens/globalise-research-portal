# Legacy viewer

This folder preserves viewer behavior that has not yet been transferred to the active manifest implementation. Do not add new features here.

Remove a legacy part only after its equivalent exists in `packages/manifest` and the active viewer no longer depends on its styles or API.

The legacy exports remain available from `@globalise/design` for compatibility and are deprecated for new work. They will be removed once their functionality has been transferred or is no longer in use. Use `@globalise/design/viewer` for active viewer components.
