import { createFileRoute } from '@tanstack/react-router'
import {
  ManifestFacsimilePage
} from "../../ManifestFacsimilePage.tsx";

export const Route = createFileRoute('/manifest/facsimile')({
  component: ManifestFacsimilePage,
})