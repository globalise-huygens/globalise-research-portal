import { asArray } from '@globalise/common';
import { isEntity, isEntityBody } from '@globalise/common/annotation';
import { useDocumentStore } from '@globalise/common/document';

const TEST_ANNOTATION_ID =
  'https://data.globalise.huygens.knaw.nl/' +
  'hdl:20.500.14722/annotations:entities:' +
  'NL-HaNA_1.04.02_3598_0027#annotation:246';

const BUILT_ENVIRONMENT_CONCEPT = {
  id:
    'https://data.globalise.huygens.knaw.nl/' +
    'hdl:20.500.14722/thesaurus:eb9beeb2-aa32-4056-ac61-dc9c53c22d23',
  type: 'Type',
  _label: 'Built Environment',
};

/**
 * Temporary local fixture for testing an unlinked entity card with a linked
 * thesaurus-concept card. It augments only annotation 246 ("zeehoofd") and
 * does not alter the fetched source data.
 */
export function installLocalLinkedConceptFixture() {
  const applyFixture = () => {
    const state = useDocumentStore.getState();

    for (const [canvasId, canvas] of Object.entries(state.canvases)) {
      const annotation = canvas.annotations?.[TEST_ANNOTATION_ID];
      if (!annotation || !isEntity(annotation)) {
        continue;
      }

      const bodies = asArray(annotation.body);
      if (bodies.some(
        (body) => isEntityBody(body) && body.ascribes_classification?.id ===
          BUILT_ENVIRONMENT_CONCEPT.id,
      )) {
        continue;
      }

      const nextBodies = bodies.map((body) =>
        isEntityBody(body) && body.label === 'zeehoofd'
          ? {
            ...body,
            ascribes_classification: BUILT_ENVIRONMENT_CONCEPT,
          }
          : body,
      );

      useDocumentStore.setState((current) => ({
        canvases: {
          ...current.canvases,
          [canvasId]: {
            ...current.canvases[canvasId],
            annotations: {
              ...current.canvases[canvasId].annotations,
              [TEST_ANNOTATION_ID]: {
                ...annotation,
                body: nextBodies,
              },
            },
          },
        },
      }));
    }
  };

  applyFixture();
  return useDocumentStore.subscribe(applyFixture);
}
