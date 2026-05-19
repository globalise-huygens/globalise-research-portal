import { createFileRoute } from '@tanstack/react-router'
import {
  ManifestTranscriptionExample
} from "../../manifest/ManifestPageTranscriptionExample.tsx";

export const Route = createFileRoute('/manifest/transcription')({
  component: ManifestTranscriptionExample,
})