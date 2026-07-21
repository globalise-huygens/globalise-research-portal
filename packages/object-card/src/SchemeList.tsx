import { useEffect } from 'react';
import { loadSchemes, useSchemes } from './SchemesSlice.ts';
import { loadConcept } from './ConceptSlice.ts';
import { conceptLabel } from './ObjectCardModel.ts';

export function SchemeList() {
  const { schemes, isLoading, isReady, error } = useSchemes();

  useEffect(() => {
    void loadSchemes();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }
  if (isLoading || !isReady) {
    return <div>Loading...</div>;
  }

  console.log(SchemeList.name, { schemes });
  return (
    <>
      <h1>Schemes</h1>
      <p>
        {schemes.map((scheme) => (
          <span key={scheme.id} style={{ paddingRight: '0.25rem', lineHeight: '2rem' }}>
            <button onClick={() => void loadConcept(scheme.id)}>
              {conceptLabel(scheme)}
            </button>
          </span>
        ))}
      </p>
    </>
  );
}