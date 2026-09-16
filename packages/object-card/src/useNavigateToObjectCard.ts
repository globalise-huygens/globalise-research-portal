import { useNavigate } from '@tanstack/react-router';

/**
 * Open a concept or entity on the object card page.
 */
export function useNavigateToObjectCard() {
  const navigate = useNavigate();
  return (uri: string) => {
    void navigate({ to: '/object-card', search: { uri } });
  };
}
