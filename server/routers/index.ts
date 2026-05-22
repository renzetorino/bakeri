/**
 * This file contains the root router of tRPC-backend
 */


import { inferRouterInputs, inferRouterOutputs, lazy } from '@trpc/server';
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
  orders: lazy(() => import('./orders').then((m) => m.ordersRouter)),
});

export type TRPCRouter = typeof trpcRouter;
export type RouterInputs = inferRouterInputs<TRPCRouter>;
export type RouterOutputs = inferRouterOutputs<TRPCRouter>;

/**
 * Create a server-side context for the tRPC API.
 */


/**
 * Create a server-side caller for the tRPC API.
 */
export const caller = createCallerFactory(trpcRouter);
