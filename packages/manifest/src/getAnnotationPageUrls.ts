export function getAnnotationPageUrls(
  annotations: { id: string; type: string }[],
): string[] {
  return annotations
    .filter((a) => a.type === 'AnnotationPage')
    .map((a) => a.id);
}