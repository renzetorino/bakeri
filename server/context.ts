import { auth } from '@/lib/auth/config';
import { db } from '@/lib/db';
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

/**
 * Creates context for an incoming request
 * @see https://trpc.io/docs/v11/context
 */
export const createTRPCContext = async <
  T extends FetchCreateContextFnOptions & { headers?: Headers },
>(
  opts: Partial<T>,
) => {
  const session = await auth.api.getSession({
    headers: new Headers(opts.headers ?? opts.req?.headers),
  });

  return {
    db,
    session,
  };
};

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;