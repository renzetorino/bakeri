import { inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import type { auth } from './config';

export const authClient = createAuthClient({
  // Don't set a fixed baseURL for multi-tenant - use current origin
  // better-auth will automatically use window.location.origin on the client
  // fetchOptions: {
  //   credentials: 'include', // Critical for cookie-based sessions
  // },
  plugins: [inferAdditionalFields<typeof auth>()],
});
