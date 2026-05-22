'use client';

import { useTRPC } from '@/lib/trpc/client';

export const useAppTrpc = () => {
  return useTRPC();
};
