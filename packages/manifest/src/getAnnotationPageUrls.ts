export function getAnnotationPageUrls(
  canvas: { annotations?: { id: string; type: string }[] },
): string[] {
  return (canvas.annotations ?? [])
    .filter((a) => a.type === 'AnnotationPage')
    .map((a) => a.id);
}