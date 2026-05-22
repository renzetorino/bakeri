'use client';

import { useEffect, useState } from 'react';
import { supabaseClient } from '@/lib/auth/supabase-client';

export const useAuthSession = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabaseClient.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };

    getSession();

    const { data: listener } =
      supabaseClient.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    user: session?.user,

    isAuthenticated: !!session,
    isPending: loading,
  };
};