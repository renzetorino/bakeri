'use client';
import { supabaseClient } from '@/lib/auth/supabase-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
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

  const isLoading = isSubmitting;

  const onSubmit = async ({ email, password }: LoginFormValues) => {
    setServerError(null);
    setHasLoggedIn(false);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to sign in');
      }

      setHasLoggedIn(true);

      
      await supabaseClient.auth.setSession({
        access_token: result.session.access_token,
        refresh_token: result.session.refresh_token,
      });

      
      setTimeout(() => {
        router.push('/');
      }, 1000);
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
          {/* {isSessionPending ? (
            <p className="text-muted-foreground text-sm">
              Verifying session…
            </p>
          ) : null} */}

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
