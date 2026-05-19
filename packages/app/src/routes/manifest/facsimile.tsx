import { createFileRoute } from '@tanstack/react-router'
import {
  ManifestPageFacsimileExample
} from "../../manifest/ManifestPageFacsimileExample.tsx";

export const Route = createFileRoute('/manifest/facsimile')({
  component: ManifestPageFacsimileExample,
})