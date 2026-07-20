import { createFileRoute } from '@tanstack/react-router';
import { ObjectCardPage } from '../../ObjectCardPage.tsx';

export const Route = createFileRoute('/object-card/')({
  component: ObjectCardPage,
});