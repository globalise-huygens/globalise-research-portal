import {CanvasId} from "../document";

export const canvasName = (id?: CanvasId) => id?.split('/').pop() ?? 'unknown-canvas'

type Log = { id: string, name: string, action: string, time: number };
const lastLogs: Map<CanvasId, Log> = new Map()

const showLogs = false;

export function traceCanvas(id: CanvasId | undefined, action: string) {
  if(!showLogs) {
    return;
  }
  if(!id) {
    return;
  }
  const now = Date.now();
  const lastLog = lastLogs.get(id)
  const name = lastLog?.name ?? canvasName(id)
  const newLog: Log = {
    id,
    name,
    action,
    time: now
  }
  lastLogs.set(id, newLog)

  if(!lastLog) {
    console.log(`Canvas ${name} ${action} at ${now}`)
    return;
  }

  const diff = lastLog ? now - lastLog.time : 0
  console.log(`${nameAction(name, action)} happened ${diff}ms after ${lastLog.action} (${now})`)
}

export function nameAction(name: string, action: string) {
  return `Canvas ${name} ${action}`;
}
