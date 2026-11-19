export const annotationPresentationFamilies = [
  'person',
  'location',
  'polity',
  'date',
  'document',
  'organisation',
  'commodity',
  'ship',
  'concept',
] as const;

export type AnnotationPresentationFamily =
  (typeof annotationPresentationFamilies)[number];

export function getPresentationFamily(
  type: string,
): AnnotationPresentationFamily | undefined {
  switch (type.toLowerCase()) {
    case 'person':
      return 'person';
    case 'location':
    case 'place':
      return 'location';
    case 'polity':
    case 'rulership':
      return 'polity';
    case 'date':
      return 'date';
    case 'document':
    case 'conversion':
    case 'occurrence':
      return 'document';
    case 'organisation':
    case 'organization':
      return 'organisation';
    case 'commodity':
    case 'dimensions':
    case 'quantity':
      return 'commodity';
    case 'ship':
    case 'voyage':
      return 'ship';
    case 'classification':
    case 'concept':
    case 'conceptscheme':
    case 'collection':
      return 'concept';
    default:
      return undefined;
  }
}
