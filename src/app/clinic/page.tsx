"use client";
import { UserContext } from "@/context/UserProvider";
import { useUser } from "@clerk/nextjs";
import { useContext } from "react";

export default function ClinicPage() {
  const { clinic: selectedClinic } = useContext(UserContext);

  const { user } = useUser();

  if (!selectedClinic) return <>loading...</>;

  return (
    <main className="m-auto min-w-[300px] max-w-7xl p-4">
      {JSON.stringify(selectedClinic)}
      <div>
        {user &&
          user.publicMetadata.clinics
            ?.find((clinic) => clinic.clinicId === selectedClinic.id)
            ?.roles.map((role) => <p key={role}>{role}</p>)}
      </div>
    </main>
  );
}
