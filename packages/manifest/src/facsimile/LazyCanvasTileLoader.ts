import { TiledImage, Viewer } from 'openseadragon';
import { CanvasId, LazyTiledImage } from './LazyCollectionViewerModel.ts';
import { fitLayout } from './util/fitLayout.ts';
import { fetchJson, noop } from '@globalise/common';
import { throttle } from 'lodash';

export type LazyCanvasTileLoaderOptions = {
  /**
   * Index of initial canvas to display
   */
  initialCanvas?: number;

  /**
   * Callback when selected canvas changes.
   * Selected scan is the scan at the center of the viewport.
   */
  onCanvasChange: (index: number) => void;

  /**
   * Callback when loaded canvases change.
   */
  onLoadedChange: (loadedIds: Set<CanvasId>) => void;

  /**
   * How many viewport heights outside of the viewport should canvasses start loading?
   *
   * Uses openseadragon viewport coordinate system:
   * https://openseadragon.github.io/examples/viewport-coordinates/
   */
  loadingBuffer?: number;

  /**
   * Height of image compared to the viewport
   */
  canvasHeight?: number;
};

const defaultOptions = {
  loadingBuffer: 2,
  initialCanvas: 0,
  canvasHeight: 0.5,
};

/**
 * Load and unload tile images on openseadragon viewport scrolling.
 */
export class LazyCanvasTileLoader {
  private viewer: Viewer;
  private canvases: LazyTiledImage[];
  private loadingBuffer: number;
  private loaded = new Map<CanvasId, TiledImage>();
  private pending = new Set<CanvasId>();

  private onLoadedChange: (loadedIds: Set<CanvasId>) => void;
  private onCanvasChange: (index: number) => void;
  private onChangeViewport: () => void;

  private frameId: number | null = null;

  constructor(
    viewer: Viewer,
    canvases: LazyTiledImage[],
    options: LazyCanvasTileLoaderOptions,
  ) {
    this.viewer = viewer;
    this.canvases = canvases;

    const {
      loadingBuffer,
      canvasHeight,
      initialCanvas,
      onCanvasChange,
      onLoadedChange,
    } = { ...defaultOptions, ...options };
    this.loadingBuffer = loadingBuffer;
    this.onLoadedChange = onLoadedChange;
    this.onCanvasChange = onCanvasChange;

    const startIndex = initialCanvas < canvases.length
      ? initialCanvas
      : 0;
    fitLayout(viewer, canvases[startIndex], canvasHeight);
    this.updateCanvasTilesThrottled();

    this.onChangeViewport = () => {
      this.onCanvasChange(this.findCenterScan())
      this.updateCanvasTilesThrottled();
    };

    this.viewer.addHandler('viewport-change', this.onChangeViewport);
    this.viewer.addHandler('animation', this.onChangeViewport);
  }

  /**
   * Check viewport bounds, mounts visible canvases, and drops hidden ones.
   */
  public updateCanvasTilesThrottled = throttle(() => {
    if (!this.viewer.viewport) {
      return;
    }
    const bounds = this.viewer.viewport.getBounds(true);
    const buffer = bounds.height * this.loadingBuffer;
    const top = bounds.y - buffer;
    const bottom = bounds.y + bounds.height + buffer;

    const shouldBeVisible = new Set<string>();

    for (const canvas of this.canvases) {
      if (canvas.y + canvas.height > top && canvas.y < bottom) {
        const canvasId = canvas.canvasId;
        shouldBeVisible.add(canvasId);
        if (!this.loaded.has(canvasId) && !this.pending.has(canvasId)) {
          void this.addCanvas(canvas);
        }
      }
    }

    let canvasesChanged = false;
    for (const [canvasId, item] of this.loaded) {
      if (!shouldBeVisible.has(canvasId)) {
        this.viewer.world.removeItem(item);
        this.loaded.delete(canvasId);
        canvasesChanged = true;
      }
    }
    if (canvasesChanged) {
      this.onLoadedChangeBatched();
    }
  }, 150)

  /**
   * Clear active tile images, loaded images, and pending requests.
   */
  public destroy(): void {
    this.viewer.removeHandler('viewport-change', this.onChangeViewport);
    this.viewer.removeHandler('animation', this.onChangeViewport);

    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }

    this.viewer.world.removeAll();
    this.loaded.clear();
    this.pending.clear();
  }

  /**
   * Collect load/unload canvas events into a single callback per frame
   * to render smoothly when scrolling fast
   */
  private onLoadedChangeBatched(): void {
    if (this.frameId !== null) {
      return;
    }
    this.frameId = requestAnimationFrame(() => {
      this.frameId = null;
      this.onLoadedChange(new Set(this.loaded.keys()));
    });
  }

  private findCenterScan(): number {
    const bounds = this.viewer.viewport.getBounds(true);
    const center = bounds.y + bounds.height / 2;
    let closest = 0;
    let closestDistance = Infinity;

    for (let i = 0; i < this.canvases.length; i++) {
      const { y, height } = this.canvases[i];
      const distance = Math.abs(y + height / 2 - center);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = i;
      }
    }
    return closest;
  }

  /**
   * Fetch iiif info endpoint and position tile images vertically.
   */
  private async addCanvas(canvas: LazyTiledImage): Promise<void> {
    this.pending.add(canvas.canvasId);
    try {
      const tileSource = await this.fetchInfo(canvas.imageServiceUrl);
      if (!this.pending.has(canvas.canvasId)) {
        return;
      }
      this.viewer.addTiledImage({
        tileSource,
        x: 0,
        y: canvas.y,
        width: 1,
        // @ts-expect-error type mismatch
        success: (event: { item: TiledImage }) => {
          this.pending.delete(canvas.canvasId);
          this.loaded.set(canvas.canvasId, event.item);
          this.onLoadedChangeBatched();
        },
        error: () => {
          this.pending.delete(canvas.canvasId);
        },
      });
    } catch {
      this.pending.delete(canvas.canvasId);
    }
  }

  private async fetchInfo(
    imageServiceUrl: string,
  ): Promise<object> {
    const url = `${imageServiceUrl}/info.json`;
    return fetchJson(url);
  }
}