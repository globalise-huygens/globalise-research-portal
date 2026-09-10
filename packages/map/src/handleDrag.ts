import versor from 'versor';
import { GeoProjection } from 'd3-geo';
import { pointers } from 'd3-selection';
import { D3DragEvent, drag } from 'd3-drag';

type DragEvent = D3DragEvent<HTMLCanvasElement, unknown, unknown>;

export default function handleDrag(projection: GeoProjection) {
  let v0: [number, number, number];
  let r0: [number, number, number];
  let q0: [number, number, number, number];
  let a0 = 0;

  function position(event: DragEvent, element: HTMLCanvasElement): [number, number] | [number, number, number] {
    const pts = pointers(event, element);
    if (pts.length === 1) {
      return pts[0];
    }

    const [p0, p1] = pts;
    const x = (p0[0] + p1[0]) / 2;
    const y = (p0[1] + p1[1]) / 2;
    const angle = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]);

    return [x, y, angle];
  }

  function dragStarted(this: HTMLCanvasElement, event: DragEvent) {
    const p = position(event, this);
    r0 = projection.rotate();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    v0 = versor.cartesian(projection.invert!([p[0], p[1]])!);
    q0 = versor(r0);

    if (p.length === 3) {
      a0 = p[2];
    }
  }

  function dragged(this: HTMLCanvasElement, event: DragEvent) {
    const p = position(event, this);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const v1 = versor.cartesian(projection.rotate(r0).invert!([p[0], p[1]])!);
    const delta = versor.delta(v0, v1);

    let q1 = versor.multiply(q0, delta);
    if (p.length === 3) {
      const d = (p[2] - a0) / 2;
      const s = -Math.sin(d);
      const c = Math.sign(Math.cos(d));
      q1 = versor.multiply([Math.sqrt(1 - s * s), 0, 0, c * s], q1);
    }

    projection.rotate(versor.rotation(q1));
  }

  return drag<HTMLCanvasElement, unknown>()
    .on('start', dragStarted)
    .on('drag', dragged);
}
