"use client"

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth/client';
import { useTRPC } from '@/lib/trpc/client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

const AdminPage = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const { data: user, isLoading } = useQuery(
    trpc.users.getByEmail.queryOptions({
      email: 'admin@example.com',  
       
    }),
  );

  console.log({ user })

  return (
    <div className="flex justify-center items-center h-screen w-full">
        <Button
          type="submit"
          className="bg-primary-500 h-10 w-[250px] rounded-md text-white"
          onClick={async () => {
            await authClient.signOut();
            router.push('/');
          }}
        >
          Logout
        </Button>
    </div>
  );
};

export default AdminPage;