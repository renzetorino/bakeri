import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import z, { ZodError } from 'zod';
import type { TRPCContext } from './context';

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
  errorFormatter: ({ shape, error }) => {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error instanceof ZodError ? z.treeifyError(error) : null,
      },
    };
  },
  sse: {
    maxDurationMs: 5 * 60 * 1000, // 5 minutes
    ping: {
      enabled: true,
      intervalMs: 3000,
    },
    client: {
      reconnectAfterInactivityMs: 5000,
    },
  },
});

export const createCallerFactory = t.createCallerFactory;

/**
 * Create a router
 * @see https://trpc.io/docs/v11/router
 */
export const router = t.router;

/**
 * Create an unprotected procedure
 * @see https://trpc.io/docs/v11/procedures
 **/
export const publicProcedure = t.procedure;

/**
 * @see https://trpc.io/docs/v11/merging-routers
 */
export const mergeRouters = t.mergeRouters;

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

/**
 * Protected base procedure
 * @see https://trpc.io/docs/v11/procedures#protected-base-procedure
 */
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
