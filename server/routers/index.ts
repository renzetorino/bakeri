/**
 * This file contains the root router of tRPC-backend
 */

import { cachedSession } from '@/lib/auth/utils-server';
import { db } from '@/lib/db';
import { inferRouterInputs, inferRouterOutputs, lazy } from '@trpc/server';
import { cache } from 'react';
import type { TRPCContext } from '../context';
import { createCallerFactory, publicProcedure, router } from '../trpc';

export const trpcRouter = router({
  healthcheck: publicProcedure.query(() => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }),

  // TODO: Add more routes here
  users: lazy(() => import('./users')),
});

export type TRPCRouter = typeof trpcRouter;
export type RouterInputs = inferRouterInputs<TRPCRouter>;
export type RouterOutputs = inferRouterOutputs<TRPCRouter>;

/**
 * Create a server-side context for the tRPC API.
 */
const createCallerContext = cache(
  async (): Promise<TRPCContext> => ({
    session: await cachedSession(),
    db: db,
  }),
);

/**
 * Create a server-side caller for the tRPC API.
 */
export const caller = createCallerFactory(trpcRouter)(createCallerContext);
