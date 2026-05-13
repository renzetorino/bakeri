import { trpcDebug as debug } from '@/lib/debug';
import { createTRPCContext } from '@/server/context';
import { trpcRouter } from '@/server/routers';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: trpcRouter,
    createContext: createTRPCContext,
    onError: ({ error }) => {
      debug('%o', error);
    },
  });

export { handler as GET, handler as POST };
