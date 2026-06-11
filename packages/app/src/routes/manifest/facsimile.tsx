import { createFileRoute } from '@tanstack/react-router';
import {
  ManifestPageFacsimilePage,
} from '../../ManifestPageFacsimilePage.tsx';

export const Route = createFileRoute('/manifest/facsimile')({
  component: ManifestPageFacsimilePage,
});