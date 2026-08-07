import type { Annotation, Id, PartOf } from '@globalise/common/annotation';
import { findSvgPath } from '@globalise/common/annotation';

type Props = {
  annotations: Record<Id, Annotation>;
  page: PartOf;
  ids: Id[];
};

type IdWithPath = { id: Id; d: string };

export function RawPathOverlay({ annotations, page, ids }: Props) {
  const paths = ids
    .map((id) => ({ id, d: findPathData(annotations[id]) }))
    .filter((p): p is IdWithPath => !!p.d);

  return <svg
    className="raw-paths"
    viewBox={`0 0 ${page.width} ${page.height}`}
    preserveAspectRatio="none"
  >
    {paths.map(({ id, d }) => <path key={id} d={d}/>)}
  </svg>;
}

function findPathData(annotation?: Annotation): string | undefined {
  if (!annotation) {
    return undefined;
  }
  const svgPath = findSvgPath(annotation);
  if (!svgPath) {
    return undefined;
  }
  return /d="([^"]+)"/.exec(svgPath)?.[1];
}