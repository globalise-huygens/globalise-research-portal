import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';

export type UriPath = '/object-card' | '/catalog';

/**
 * Load the uri of the route, and follow the store
 * when it moves to another uri.
 */
export function useUriSync(
  uri: string,
  loadedUri: string | null,
  load: (uri: string) => Promise<void>,
  to: UriPath,
) {
  const navigate = useNavigate();

  useEffect(() => {
    load(uri).catch(console.error);
  }, [uri, load]);

  useEffect(() => {
    if (loadedUri && loadedUri !== uri) {
      void navigate({ to, search: { uri: loadedUri } });
    }
  }, [loadedUri, uri, navigate, to]);
}
