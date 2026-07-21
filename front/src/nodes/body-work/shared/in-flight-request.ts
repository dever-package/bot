export function createInFlightRequestLoader<T>() {
  const requests = new Map<string, Promise<T>>();

  return (key: string, load: () => Promise<T>) => {
    const existing = requests.get(key);
    if (existing) {
      return existing;
    }

    let current: Promise<T>;
    current = Promise.resolve()
      .then(load)
      .finally(() => {
        if (requests.get(key) === current) {
          requests.delete(key);
        }
      });
    requests.set(key, current);
    return current;
  };
}
