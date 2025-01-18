import edgeStoreRouter from '@/app/api/edgestore/[...edgestore]/route';
import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/app';
import { initEdgeStoreClient } from '@edgestore/server/core';

export const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
});


export const backendClient = initEdgeStoreClient({
  router: edgeStoreRouter,
});