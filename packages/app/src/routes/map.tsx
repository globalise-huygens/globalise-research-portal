import { createFileRoute } from '@tanstack/react-router';
import { MapDemo } from '@globalise/map';

export const Route = createFileRoute('/map')({
  component: MapDemo,
});
