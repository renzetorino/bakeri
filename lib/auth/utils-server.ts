import 'server-only';

import { headers } from 'next/headers';
import { cache } from 'react';
import { auth } from './config';

export const getSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
};

export const cachedSession = cache(getSession);
