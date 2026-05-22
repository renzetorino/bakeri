import { db } from '@/lib/db';
import { supabase } from '@/lib/auth/config';
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

/**
 * Creates context for an incoming request
 */
export const createTRPCContext = async <
  T extends FetchCreateContextFnOptions & { headers?: Headers },
>(
  opts: Partial<T>,
) => {
  const authHeader = opts.headers?.get('authorization');

  const token = authHeader?.replace('Bearer ', '');

  let user = null;

  if (token) {
    const { data } = await supabase.auth.getUser(token);
    user = data.user;
  }

  return {
    db,
    user, 
  };
};

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;