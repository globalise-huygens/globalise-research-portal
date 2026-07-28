import { useEffect } from 'react';
import { loadSchemes, useSchemes } from './SchemesSlice.ts';
import { loadConcept, useCurrentSchemeId } from './ConceptSlice.ts';
import { getConceptLabel } from './SkosModel.ts';

export function SchemeList() {
  const { schemes, isLoading, isReady, error } = useSchemes();
  const currentSchemeId = useCurrentSchemeId();

  useEffect(() => {
    void loadSchemes();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }
  if (isLoading || !isReady) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <span className="list-label">Schemes: </span>
      {schemes.map((scheme) => {
        const isCurrent = scheme.id === currentSchemeId;
        return (
          <span key={scheme.id}
            style={{ paddingRight: '0.25rem', lineHeight: '2rem' }}
          >
            <button
              onClick={() => void loadConcept(scheme.id)}
              aria-current={isCurrent || undefined}
            >
              {isCurrent ?
                <strong>{getConceptLabel(scheme)}</strong> : getConceptLabel(scheme)}
            </button>
          </span>
        );
      })}
    </>
  );
}