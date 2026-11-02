# content

Turns the editorial pages of the [content repo](https://github.com/globalise-huygens/globalise-portal-content) into json for the portal. Markdown is written with yaml front matter and pushed to the globalise-research-content repo. The globalise-research-portal uses this repo as an optional submodule. Every page is checked and converted one by one: a page with errors is skipped and reported, the rest is built. The build fails on an error, use `--force` to continue.

## Development and build

Run from the repo root:

```shell
pnpm content:init
pnpm content:build
pnpm content:build --force
```

Moving to newer content:

```shell
pnpm content:fetch
pnpm content:checkout [hash]
pnpm content:update
```

Output is created in `packages/app/dist/content/`:

- `index.json`: the meta of all built pages
- `pages/<slug>.json`: meta and body of one page
- `report/errors.json`: every file with errors and its error messages; these pages were skipped
- `report/warnings.json`: every file with warnings and its warning messages; these pages were built

The app reads the output at runtime from the path in `GLOBALISE_CONTENT` and shows an index at `/content`.

Requires Node 22.18 or later to run TypeScript directly
