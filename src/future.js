import { createResource, createCache } from "simple-cache-provider";

const cache = createCache(() => {});

export function createFetcher(resolver) {
  const resource = createResource(resolver);
  return {
    read: key => resource.read(cache, key)
  };
}

