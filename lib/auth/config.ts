import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { randomUUID } from 'node:crypto';
import { db } from '../db';
import * as schema from '../db/schema';

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.users,
      account: schema.accounts,
      session: schema.sessions,
      verificationToken: schema.verificationTokens,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  // socialProviders: {
  //   google: {
  //     clientId: process.env.GOOGLE_CLIENT_ID || '',
  //     clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  //   },
  //   github: {
  //     clientId: process.env.GITHUB_CLIENT_ID || '',
  //     clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
  //   },
  // },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  trustedOrigins: [
      process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
      'http://localhost:3000',
  ],
  advanced: {
    database: {
      generateId: () => randomUUID(),
    },
  },
});
