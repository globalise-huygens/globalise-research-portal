import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  loadResource,
  ObjectCardView,
  useObjectCardStore,
} from '@globalise/object-card';
import '@globalise/design/styles.css';

export type ResourcePath = '/object-card' | '/catalog';

type ResourcePageProps = {
  uri: string;
  to: ResourcePath;
};

export function ResourcePage({ uri, to }: ResourcePageProps) {
  const navigate = useNavigate();

  useEffect(() => {
    loadResource(uri).catch(console.error);
  }, [uri]);

  useEffect(() => useObjectCardStore.subscribe((state, prev) => {
    const loaded = state.resourceState.uri;
    if (!loaded || loaded === prev.resourceState.uri) {
      return;
    }
    void navigate({ to, search: { uri: loaded } });
  }), [navigate, to]);

  return <ObjectCardView/>;
}
