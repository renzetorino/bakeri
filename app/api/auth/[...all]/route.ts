import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Auth API - no longer using better-auth' });
}

export async function POST() {
  return NextResponse.json({ message: 'Auth API - no longer using better-auth' });
}
