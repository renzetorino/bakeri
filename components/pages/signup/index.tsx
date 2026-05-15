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
  email: z.email('Please enter a valid email address'),
  password: z
    .string()
    .trim()
    .min(8, { message: 'Password must be at least 8 characters.' })
    .regex(/[A-Za-z]/, {
      message: 'Password must contain at least one letter.',
    })
    .regex(/\d/, { message: 'Password must contain at least one number.' })
    .regex(/[^A-Za-z0-9]/, {
      message: 'Password must contain at least one symbol.',
    }),
  confirmPassword: z
    .string()
    .trim()
    .min(8, { message: 'Password must be at least 8 characters.' })
    .regex(/[A-Za-z]/, {
      message: 'Password must contain at least one letter.',
    })
    .regex(/\d/, { message: 'Password must contain at least one number.' })
    .regex(/[^A-Za-z0-9]/, {
      message: 'Password must contain at least one symbol.',
    }),
  username: z.string().min(1, 'Username is required.'),
  address: z.string().min(1, 'Address is required.'),
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
      username: '',
      confirmPassword: '',
      address: '',
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

    /**
     * @todo implement signup logic to supabase
     */

    // try {
    //   const result = await authClient.signIn.email({ email, password });

    //   if (result.error) {
    //     throw result.error;
    //   }

    //   setHasLoggedIn(true);
    //   await sessionState.refetch();
    // } catch (error) {
    //   const message =
    //     error instanceof Error
    //       ? error.message
    //       : 'Failed to sign in. Please check your credentials and try again.';
    //   setServerError(message);
    // }
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <form
        className="flex h-full w-full flex-col pt-12 items-center justify-center"
        onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4 w-full px-32">
          <h1 className="text-primary-700 text-[32px] leading-8 font-medium tracking-[0.449px]">
            Sign up
          </h1>

          <div className="grid grid-cols-2 gap-4">
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
                name="username"
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    placeholder="Username"
                    className="border-primary-100 h-10 w-full rounded-md border p-2"
                    autoComplete="username"
                  />
                )}
              />
              {errors.email ? (
                <p className="text-xs text-red-600">{errors.email.message}</p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Controller
              control={control}
              name="address"
              render={({ field }) => (
                <Input
                  {...field}
                  type="textarea"
                  placeholder="Address"
                  className="border-primary-100 h-10 w-full rounded-md border p-2"
                  autoComplete="address"
                />
              )}
            />
            {errors.address ? (
              <p className="text-xs text-red-600">{errors.address.message}</p>
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
          <div className="flex flex-col gap-1">
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field }) => (
                <Input
                  {...field}
                  type="password"
                  placeholder="Confirm Password"
                  className="border-primary-100 h-10 w-full rounded-md border p-2"
                  autoComplete="current-password"
                />
              )}
            />
            {errors.confirmPassword ? (
              <p className="text-xs text-red-600">{errors.confirmPassword.message}</p>
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

          <p className="text-primary-500 text-sm">Already have an account? <Link href="/auth/login" className="underline">Sign in</Link></p>
        </div>
      </form>
    </div>
  );
}
