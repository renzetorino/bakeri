import { authClient } from '@/lib/auth/client';

export const useAuthSession = () => {
  const { data: session, isPending, error } = authClient.useSession();

  const isAuthenticated = !!session;
  const hasSession = !isPending && !!session;
  const hasNoSession = !isPending && !session && !error;

  return {
    session,
    user: session?.user,

    // loading & error
    isPending,
    error,

    // auth state
    isAuthenticated,
    hasSession,
    hasNoSession,
  };
};
