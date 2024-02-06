"use client";
import { useUser } from "@clerk/nextjs";
import Loader from "./Loader";

interface UserLoaderProps {
  children: React.ReactNode;
}

export default function UserLoader({ children }: UserLoaderProps) {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return <Loader />;

  return <>{children}</>;
}
