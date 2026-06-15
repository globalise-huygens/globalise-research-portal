import {CanvasId} from "../document";

export const canvasName = (id?: CanvasId) => id?.split('/').pop() ?? 'unknown-canvas'

type Log = { id: CanvasId, action: string, time: number };
const lastLogs: Map<CanvasId, Log> = new Map()

export function traceCanvas(id: CanvasId, action: string) {
  const now = Date.now();
  const newLog: Log = {
    id,
    action,
    time: now
  }
  const lastLog = lastLogs.get(id)
  lastLogs.set(id, newLog)
  if(!lastLog) {
    console.log(`Canvas ${id} ${action} at ${now}`)
    return;
  }
  const diff = lastLog ? now - lastLog.time : 0
  console.log(`Canvas ${id} ${action} happened ${diff}ms after ${lastLog.action} (${now})`)
}