"use client";
import { getClinic } from "@/network/api/clinic";
import { useUser } from "@clerk/nextjs";
import { Clinic } from "@prisma/client";
import { useEffect, useState } from "react";

interface ClinicPageProps {
  searchParams: { clinicId: string };
}

export default function ClinicPage({
  searchParams: { clinicId },
}: ClinicPageProps) {
  const { user } = useUser();
  const [clinic, setClinic] = useState<Clinic>();
  useEffect(() => {
    const fetchData = async () => {
      const clinic = await getClinic(clinicId);
      setClinic(clinic);
    };
    fetchData();
  }, [clinicId]);
  if (!clinic) return <>loading...</>;

  return (
    <div>
      {JSON.stringify(clinic)}
      <p>
        {user &&
          user.publicMetadata.clinics
            ?.find((clinic) => clinic.clinicId === clinicId)
            ?.roles.map((role) => <p key={role}>{role}</p>)}
      </p>
    </div>
  );
}
