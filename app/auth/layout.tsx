import Image from "next/image";
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-full flex-row items-center">
      <div className="w-full h-full bg-black-500 relative">
        <Image src="/images/auth/background.jpg" alt="logo" fill className="object-cover" />
      </div>
      <div className="w-full h-full bg-white">{children}</div>
    </div>
  );
};

export default AuthLayout;