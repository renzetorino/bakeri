import { userAccount } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import z from 'zod';
import { protectedProcedure, publicProcedure, router } from '../trpc';

export default router({
  getByEmail: protectedProcedure
    .input(
      z.object({
        email: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.select().from(userAccount).where(eq(userAccount.email, input.email));
    }),

  getListOfUsers: protectedProcedure
    .query(({ ctx }) => {
      return ctx.db.select().from(userAccount);
    }),

});
