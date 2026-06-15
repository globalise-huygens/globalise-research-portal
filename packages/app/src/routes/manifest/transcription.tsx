import { createFileRoute } from '@tanstack/react-router';
import {
  ManifestTranscriptionPage,
} from '../../ManifestTranscriptionPage.tsx';

export const Route = createFileRoute('/manifest/transcription')({
  component: ManifestTranscriptionPage,
});