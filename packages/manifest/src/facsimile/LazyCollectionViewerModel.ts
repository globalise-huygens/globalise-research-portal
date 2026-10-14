export type CanvasId = string;

export type LazyTiledImage = {
  canvasId: CanvasId;
  y: number;
  height: number;
  documentGap: number;
  imageServiceUrl: string;
};
