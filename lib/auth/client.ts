import { supabaseClient } from './supabase-client';

export const authClient = supabaseClient.auth;

// Helper function to get current user
export const getCurrentUser = async () => {
  const { data: { user } } = await authClient.getUser();
  return user;
};

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
  const user = await getCurrentUser();
  return !!user;
};

// Helper function to sign out
export const signOut = async () => {
  return await authClient.signOut();
};

