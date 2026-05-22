import { NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/auth/supabase-client';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = loginSchema.parse(body);

    // Sign in with Supabase Auth
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    });

    if (error) {
      console.error('Login error:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to sign in' },
        { status: 400 }
      );
    }

    if (!data?.user?.id || !data?.session?.access_token) {
      console.error('Unexpected login response: missing user or session');
      return NextResponse.json(
        { error: 'Failed to sign in' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      user: data.user,
      session: data.session,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Login failed';

    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}
