import { useLocation } from '@tanstack/react-router';

export function NotFoundPage() {
  const { pathname } = useLocation();
  return <p>404 - Could not find {pathname}</p>;
}
