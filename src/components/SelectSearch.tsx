import citiesList from "@/lib/cities-list";
import { forwardRef, useMemo, useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface SelectSearchProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
}

export default function SelectSearch<T extends FieldValues>({
  control,
  name,
}: SelectSearchProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, ...field } }) => {
        return (
          <SelectSearchInner onLocationSelected={onChange} ref={field.ref} />
        );
      }}
    />
  );
}

interface SelectSearchInnerProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onLocationSelected: (location: string) => void;
}

const SelectSearchInner = forwardRef<HTMLInputElement, SelectSearchInnerProps>(
  function SelectSearch({ onLocationSelected, ...props }, ref) {
    const [locationSearchInput, setLocationSearchInput] = useState("");
    const [hasFocus, setHasFocus] = useState(false);

    const cities = useMemo(() => {
      if (!locationSearchInput.trim()) return [];

      const searchWords = locationSearchInput.split("");

      return citiesList
        .map((city) => `${city.name}, ${city.subcountry}, ${city.country}`)
        .filter(
          (city) =>
            city.toLowerCase().startsWith(searchWords[0].toLowerCase()) &&
            searchWords.every((word) =>
              city.toLocaleLowerCase().includes(word.toLocaleLowerCase()),
            ),
        )
        .slice(0, 5);
    }, [locationSearchInput]);

    return (
      <div className="relative">
        <input
          className="input input-bordered mb-3 w-full"
          placeholder="Search for a city"
          type="search"
          onChange={(e) => setLocationSearchInput(e.target.value)}
          value={locationSearchInput}
          onFocus={() => setHasFocus(true)}
          onBlur={() => setHasFocus(false)}
          {...props}
          ref={ref}
        />
        {locationSearchInput.trim() && hasFocus && (
          <div className="bg-background absolute z-20 w-full divide-y rounded-b-sm border-x border-b shadow-xl">
            {!cities.length && <p className="p-3">No results found</p>}
            {cities.map((city) => (
              <button
                key={city}
                className="block w-full p-2 text-start"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onLocationSelected(city);
                  setLocationSearchInput(city);
                }}
              >
                {city}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  },
);
