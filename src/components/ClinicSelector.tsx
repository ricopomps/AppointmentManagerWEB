"use client";

import { UserContext } from "@/context/UserProvider";
import { useContext } from "react";

export default function ClinicSelector() {
  const {
    clinic: selectedClinic,
    userClinics,
    setClinic,
  } = useContext(UserContext);

  function handleChange(clinicId: string) {
    try {
      const clinic = userClinics.find((clinic) => (clinic.id = clinicId));
      if (!clinic) throw new Error("Clinic not found");
      setClinic(clinic);
    } catch (error) {}
  }

  return (
    <div>
      {selectedClinic && (
        <div>
          <label className="label">Clínica selecionada:</label>
          <select
            className="select select-bordered w-full flex-none"
            defaultValue={selectedClinic?.id}
            onChange={(e) => handleChange(e.target.value)}
          >
            {userClinics.map((clinic) => (
              <option
                key={clinic.id}
                disabled={!!(selectedClinic && clinic.id === selectedClinic.id)}
                value={clinic.id}
              >
                {clinic.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
