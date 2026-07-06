import { createFileRoute } from '@tanstack/react-router';
import { MetadataPage } from '../MetadataPage.tsx';

export const Route = createFileRoute('/metadata')({
  component: MetadataPage,
});