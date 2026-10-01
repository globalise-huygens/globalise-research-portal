export type RenderBudgetOptions = {
  maxRenders: number;
  windowMs?: number;
  warn?: (message: string, reasons: Record<string, number>) => void;
};

export class DebugRerenderState {
  private readonly name: string;
  private readonly maxRenders: number;
  private readonly windowMs: number;
  private readonly warn: (message: string, reasons: Record<string, number>) => void;
  private renders = 0;
  private reasons = new Map<string, number>();
  private isWindowOpen = false;

  constructor(name: string, options: RenderBudgetOptions) {
    this.name = name;
    this.maxRenders = options.maxRenders;
    this.windowMs = options.windowMs ?? 1000;
    this.warn = options.warn ?? console.warn;
  }

  record(reason: string): void {
    this.renders++;
    this.reasons.set(reason, (this.reasons.get(reason) ?? 0) + 1);
    if (!this.isWindowOpen) {
      this.isWindowOpen = true;
      setTimeout(() => this.closeWindow(), this.windowMs);
    }
  }

  private closeWindow(): void {
    if (this.renders > this.maxRenders) {
      this.warn(
        `[render budget] ${this.name}: ${this.renders} renders in ${this.windowMs} ms (max ${this.maxRenders})`,
        Object.fromEntries([...this.reasons].sort(([, a], [, b]) => b - a)),
      );
    }
    this.renders = 0;
    this.reasons.clear();
    this.isWindowOpen = false;
  }
}
