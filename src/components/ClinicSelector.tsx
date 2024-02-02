"use client";

export default function ClinicSelector() {
  return (
    <div>
      <label className="label">Clínica selecionada:</label>
      <select
        className="select select-bordered w-full flex-none"
        defaultValue={"selectedUnit"}
        // onChange={(e) => handleChange(+e.target.value)}
      >
        <option value="das">Clinica</option>
        {/* {options.map((option) => (
        <option
          key={option.value}
          disabled={option.value === selectedUnit}
          value={option.value}
        >
          {option.key}
        </option>
      ))} */}
      </select>
    </div>
  );
}
