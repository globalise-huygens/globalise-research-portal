# Globalise Research Portal

Integrate globalise design with search and document components.

Demo: https://dev.globalise.nl/

## Development

- First time: `npm i`

- Start: `npm start`
- Test: `npm t`
- Build: `npm run build`
- Check types: `npm run typecheck`

When adding a new package:
 - add path to root tsconfig.json
 - add dependency to consuming package.json
 - add path to consuming tsconfig.json

Note: `@globalise/design-system` is not yet published on npmjs.com, so add it as a dependency like this:
```
    "@globalise/design-system": "file:../globalise-design-system/packages/ui",
```