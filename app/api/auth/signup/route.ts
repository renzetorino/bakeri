import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userAccount } from '@/lib/db/schema';
import { supabase } from '@/lib/auth/supabase'; 
import { z } from 'zod';

const signupSchema = z
  .object({
    email: z.email(),
    password: z.string().min(8),
    confirmPassword: z.string(),
    username: z.string().min(1),
    address: z.string().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = signupSchema.parse(body);

    // 1. Create Supabase Auth user
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
    });

    if (error || !data.user?.id) {
      return NextResponse.json(
        { error: error?.message || 'Failed to create user' },
        { status: 400 }
      );
    }

    const user = data.user;

    // 2. Store extra profile data in your table
    await db.insert(userAccount).values({
      userid: user.id,
      username: input.username,
      email: input.email,
      address: input.address,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Signup failed',
      },
      { status: 400 }
    );
  }
}