# Globalise Research Portal

Integrate globalise design with search and document components.

Demo: https://dev.globalise.nl/

## Development

- First time: 
```shell
git clone https://github.com/globalise-huygens/globalise-design-system.git
git clone https://github.com/globalise-huygens/globalise-research-portal.git

cd globalise-design-system
pnpm install
pnpm build
cd ../

cd globalise-research-portal
npm install
npm start
```

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