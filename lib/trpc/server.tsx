import 'server-only';

import { createTRPCContext } from '@/server/context';
import { TRPCRouter, trpcRouter } from '@/server/routers';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import {
  createTRPCOptionsProxy,
  TRPCQueryOptions,
} from '@trpc/tanstack-react-query';
import { headers as nextHeaders } from 'next/headers';
import { cache } from 'react';
import { makeQueryClient } from './query-client';

export const getQueryClient = cache(makeQueryClient);

const createContext = cache(async () => {
  const headers = new Headers(await nextHeaders());
  headers.set('x-trpc-source', 'rsc');

  return createTRPCContext({ headers });
});

export const trpc = createTRPCOptionsProxy<TRPCRouter>({
  ctx: createContext,
  router: trpcRouter,
  queryClient: getQueryClient,
});

/**
 * Use within a Server Component to hydrate the query client.
 * @see https://trpc.io/docs/client/tanstack-react-query/server-components#5-create-a-trpc-caller-for-server-components
 */
export function HydrateClient(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {props.children}
    </HydrationBoundary>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function prefetch<T extends ReturnType<TRPCQueryOptions<any>>>(
  queryOptions: T,
) {
  const queryClient = getQueryClient();
  if (queryOptions.queryKey[1]?.type === 'infinite') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    void queryClient.prefetchInfiniteQuery(queryOptions as any);
  } else {
    void queryClient.prefetchQuery(queryOptions);
  }
}
