declare module 'versor' {
  export type SphericalCoordinates = [number, number];
  export type CartesianCoordinates = [number, number, number];
  export type Quaternion = [number, number, number, number];

  function versor(rotation: D3Rotation): Quaternion;

  namespace versor {
    export function cartesian(e: SphericalCoordinates): CartesianCoordinates;
    export function delta(c0: CartesianCoordinates, c1: CartesianCoordinates, t?: number): Quaternion;
    export function multiply(q0: Quaternion, q1: Quaternion): Quaternion;
    export function rotation(e: Quaternion): CartesianCoordinates;
  }

  export = versor;
}
