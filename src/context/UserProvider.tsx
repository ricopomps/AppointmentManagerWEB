"use client";

import { getRoles } from "@/lib/utils";
import { Role } from "@/models/roles";
import { getUserClinics } from "@/network/api/clinic";
import { useUser } from "@clerk/nextjs";
import { Clinic } from "@prisma/client";
import { ReactNode, createContext, useEffect, useState } from "react";

interface UserContext {
  setClinic: (clinic: Clinic) => void;
  hasRole: (roles: Role[]) => boolean;
  clinic: Clinic | null;
  userClinics: Clinic[];
  roles: Role[];
}

export const UserContext = createContext<UserContext>({
  setClinic: () => {
    throw Error("UserContext not implemented");
  },
  hasRole: () => {
    throw Error("UserContext not implemented");
  },
  clinic: null,
  userClinics: [],
  roles: [],
});

interface UserProviderProps {
  children: ReactNode;
}

export default function UserProvider({ children }: UserProviderProps) {
  const { user } = useUser();
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [userClinics, setUserClinics] = useState<Clinic[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  const hasRole = (requestedRoles: Role[]) => {
    try {
      return requestedRoles.some((role) => roles.includes(role));
    } catch (error) {
      return false;
    }
  };

  const value: UserContext = {
    setClinic: (clinic: Clinic) => setClinic(clinic),
    hasRole,
    clinic,
    userClinics,
    roles,
  };

  //Maybe transform into swr
  useEffect(() => {
    try {
      const fetchUserClinics = async () => {
        try {
          const userClinics = await getUserClinics(); //TODO: this could definitely become a swr
          setUserClinics(userClinics);
          if (!clinic && userClinics.length > 0) setClinic(userClinics[0]);
          if (clinic && user) {
            setRoles(getRoles(user, clinic.id));
          }
        } catch (error) {}
      };
      fetchUserClinics();
    } catch (error) {}
  }, [user, clinic]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
