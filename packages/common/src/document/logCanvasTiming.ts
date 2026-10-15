const prefix = '[canvas-timing]';

export function logCanvasTiming(event: string, details: object = {}) {
  console.debug(`${prefix} ${Math.round(performance.now())}ms ${event}`, details);
}

export function startCanvasTiming(event: string, details: object = {}) {
  const start = performance.now();
  logCanvasTiming(`${event} start`, details);
  return (endDetails: object = {}) => {
    const ms = Math.round(performance.now() - start);
    logCanvasTiming(`${event} end`, { ...details, ...endDetails, ms });
  };
}
