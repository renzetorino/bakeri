'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth/client';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useMemo, useState } from 'react';

import { useTRPC } from '@/lib/trpc/client';
import { useQuery } from '@tanstack/react-query';

export default function AdminLoginPage() {
  const router = useRouter();
  const sessionState = authClient.useSession();
  const { data: session, isPending: isSessionPending } = sessionState;
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasLoggedIn, setHasLoggedIn] = useState(false);

  const trpc = useTRPC();
  const { data: user, isError } = useQuery(
    trpc.users.getByEmail.queryOptions({
      email: 'admin@example.com',   
    }),
  );

  const { data: users, isError: isUsersError } = useQuery(
    trpc.users.getListOfUsers.queryOptions(),
  );

  console.log({ users })

  console.log({ user })

  useEffect(() => {
    if (session?.user) {
      router.replace('/admin');
    }
  }, [session, router]);

  const isLoading = useMemo(
    () => isSubmitting || isSessionPending,
    [isSubmitting, isSessionPending],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setHasLoggedIn(false);
    setIsSubmitting(true);

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        throw result.error;
      }

      setHasLoggedIn(true);
      await sessionState.refetch();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to sign in. Please check your credentials and try again.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <form
        className="flex h-full w-full flex-col pt-12"
        onSubmit={handleSubmit}>
        <div className="mx-auto flex w-[560px] flex-col gap-4 rounded-2xl border border-[#E5E5E5] bg-white p-10">
          <h1 className="text-primary-700 text-[24px] leading-8 font-medium -tracking-[-0.449px]">
            Login
          </h1>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="border-primary-100 h-10 w-full rounded-md border p-2"
            autoComplete="email"
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="border-primary-100 h-10 w-full rounded-md border p-2"
            autoComplete="current-password"
            required
          />
          {errorMessage ? (
            <p className="text-sm text-red-600">{errorMessage}</p>
          ) : null}
          {hasLoggedIn ? (
            <p className="text-sm text-emerald-600">
              Signed in successfully. Redirecting…
            </p>
          ) : null}
          {isSessionPending ? (
            <p className="text-muted-foreground text-sm">Checking session…</p>
          ) : null}
          <Button
            type="submit"
            className="bg-primary-500 h-10 w-full rounded-md text-white"
            disabled={isLoading}>
            {isLoading ? 'Signing in…' : 'Login'}
          </Button>
        </div>
      </form>
    </div>
  );
}
