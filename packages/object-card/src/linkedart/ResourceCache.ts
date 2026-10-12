// Share in-flight requests and retain only a bounded number of recent resources.
export function createResourceCache<T>(limit: number) {
  const requests = new Map<string, Promise<T>>();
  return (key: string, load: () => Promise<T>): Promise<T> => {
    let request = requests.get(key);
    request ??= Promise.resolve().then(load).catch((error: unknown) => {
      // An evicted request must not remove a newer request for the same key.
      if (requests.get(key) === request) {
        requests.delete(key);
      }
      throw error;
    });
    requests.delete(key);
    requests.set(key, request);
    if (requests.size > limit) {
      requests.delete(requests.keys().next().value!);
    }
    return request;
  };
}
