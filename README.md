# Globalise Research Portal

Integrate globalise design with search and document components.

Demo: https://dev.globalise.nl/

## Development

- First time: `pnpm install`

- Start: `pnpm start`
- Test: `pnpm test`
- Build: `pnpm build`
- Check types: `pnpm typecheck`

When adding a new package:
 - add path to root tsconfig.json
 - add dependency to consuming package.json
 - add path to consuming tsconfig.json

## Manifest viewer

### Resource loading

- [`fetchPatchManifest`](packages/facsimile/src/fetchPatchManifest.ts)
- [`loadCanvasAnnotationPages`](packages/common/src/document/ManifestViewerSlice.ts)
- [`loadMetadata`](packages/common/src/document/ManifestMetadataSlice.ts)
- [`loadObjectCard`](packages/object-card/src/CardSlice.ts)
- [`useLinkedConcept`](packages/app/src/ManifestEntityPreview.tsx)
- [`loadCatalog`](packages/object-card/src/hydra/HydraSlice.ts)
- [`loadSchemes`](packages/object-card/src/skos/SkosSchemesSlice.ts)

### Model types
- [`Annotation`](packages/common/src/annotation/AnnoModel.ts)
- [`AnnotationIndexes`](packages/common/src/annotation/indexAnnotations.ts)
- [`EntityBody`](packages/common/src/annotation/EntityModel.ts)
- [`SkosConcept`](packages/object-card/src/skos/SkosModel.ts)
- [`LinkedArtNode`](packages/common/src/linkedart/LinkedArtNode.ts)
- [`CanvasState`](packages/common/src/document/ManifestViewerSlice.ts)
- [`HydraCollection`](packages/object-card/src/hydra/HydraModel.ts)
