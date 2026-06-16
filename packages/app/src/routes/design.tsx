import { createFileRoute } from '@tanstack/react-router';
import { DesignPage } from '../DesignPage.tsx';

export const Route = createFileRoute('/design')({
  component: DesignPage,
});
