import { describe, expect, it, vi } from 'vitest';
import { createResourceCache } from './ResourceCache.ts';

describe('resource request cache', () => {
  it('shares concurrent requests and reuses completed results', async () => {
    const cached = createResourceCache<string>(2);
    const load = vi.fn(() => Promise.resolve('label'));
    const first = cached('a', load);
    expect(cached('a', load)).toBe(first);
    expect(await first).toBe('label');
    expect(await cached('a', load)).toBe('label');
    expect(load).toHaveBeenCalledTimes(1);
  });

  it('evicts the least recently used resource', async () => {
    const cached = createResourceCache<string>(2);
    const load = vi.fn(() => Promise.resolve('label'));
    await cached('a', load);
    await cached('b', load);
    await cached('a', load);
    await cached('c', load);
    await cached('a', load);
    expect(load).toHaveBeenCalledTimes(3);
    await cached('b', load);
    expect(load).toHaveBeenCalledTimes(4);
  });

  it('retries failures without deleting a newer request for an evicted key', async () => {
    const cached = createResourceCache<string>(1);
    let reject!: (error: Error) => void;
    const old = cached('a', () => new Promise<string>((_, fail) => { reject = fail; }));
    const rejected = expect(old).rejects.toThrow('Offline');
    await cached('b', () => Promise.resolve('other'));
    const replacement = cached('a', () => Promise.resolve('recovered'));
    reject(new Error('Offline'));
    await rejected;
    expect(cached('a', () => Promise.resolve('wrong'))).toBe(replacement);
    expect(await replacement).toBe('recovered');
    await expect(cached('c', () => Promise.reject(new Error('Offline')))).rejects.toThrow('Offline');
    expect(await cached('c', () => Promise.resolve('retry'))).toBe('retry');
  });
});
