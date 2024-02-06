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
      <div className="flex justify-center">
        <div className="card w-96 bg-secondary shadow-xl">
          <div className="card-body">
            <h2 className="card-title">{selectedClinic.name}</h2>
          </div>
        </div>
      </div>
    </main>
  );
}
