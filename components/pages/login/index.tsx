'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth/client';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required.')
    .email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const sessionState = authClient.useSession();
  const { data: session, isPending: isSessionPending } = sessionState;
  const [serverError, setServerError] = useState<string | null>(null);
  const [hasLoggedIn, setHasLoggedIn] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (session?.user) {
      router.replace('/admin');
    }
  }, [session, router]);

  const isLoading = isSubmitting || isSessionPending;

  const onSubmit = async ({ email, password }: LoginFormValues) => {
    setServerError(null);
    setHasLoggedIn(false);

    try {
      const result = await authClient.signIn.email({ email, password });

      if (result.error) {
        throw result.error;
      }

      setHasLoggedIn(true);
      await sessionState.refetch();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to sign in. Please check your credentials and try again.';
      setServerError(message);
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <form
        className="flex h-full w-full flex-col pt-12 items-center justify-center"
        onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4 w-full px-32">
          <h1 className="text-primary-700 text-[32px] leading-8 font-medium tracking-[0.449px]">
            Sign in
          </h1>

          <div className="flex flex-col gap-1">
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <Input
                  {...field}
                  type="email"
                  placeholder="Email address"
                  className="border-primary-100 h-10 w-full rounded-md border p-2"
                  autoComplete="email"
                />
              )}
            />
            {errors.email ? (
              <p className="text-xs text-red-600">{errors.email.message}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1">
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <Input
                  {...field}
                  type="password"
                  placeholder="Password"
                  className="border-primary-100 h-10 w-full rounded-md border p-2"
                  autoComplete="current-password"
                />
              )}
            />
            {errors.password ? (
              <p className="text-xs text-red-600">{errors.password.message}</p>
            ) : null}
          </div>

          {serverError ? (
            <p className="text-sm text-red-600">{serverError}</p>
          ) : null}
          {hasLoggedIn ? (
            <p className="text-sm text-emerald-600">
              Signed in successfully. Redirecting…
            </p>
          ) : null}
          {isSessionPending ? (
            <p className="text-muted-foreground text-sm">
              Verifying session…
            </p>
          ) : null}

          <Button
            type="submit"
            className="bg-primary-500 h-10 w-full rounded-md text-white"
            disabled={isLoading}>
            {isLoading ? 'Signing in…' : 'Sign in'}
          </Button>

          <div className="flex flex-row justify-between">
            <p className="text-primary-500 text-sm">Don't have an account? <Link href="/auth/signup" className="underline">Sign up</Link></p>
          </div>
        </div>
      </form>
    </div>
  );
}
