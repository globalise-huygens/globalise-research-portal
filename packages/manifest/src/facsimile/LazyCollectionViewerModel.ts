export type CanvasId = string;

export type LazyTiledImage = {
  canvasId: CanvasId;
  y: number;
  height: number;
  imageServiceUrl: string;
};
